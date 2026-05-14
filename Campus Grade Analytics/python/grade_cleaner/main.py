import json
import sys
from typing import Dict, List

import numpy as np
import pandas as pd


ALLOWED_GRADES = {10, 9, 8, 7, 6, 5, 4}


def load_payload() -> Dict:
    raw = sys.stdin.read()
    return json.loads(raw) if raw else {"course": {}, "submissions": []}


def remove_invalid_rows(frame: pd.DataFrame) -> pd.DataFrame:
    """Keep only rows with complete data, valid marks, and allowed grades."""
    if frame.empty:
        return frame

    cleaned = frame.dropna(subset=["id", "totalMarks", "normalizedGrade"]).copy()
    cleaned = cleaned[(cleaned["totalMarks"] >= 0) & (cleaned["totalMarks"] <= 100)]
    cleaned = cleaned[cleaned["normalizedGrade"].isin(ALLOWED_GRADES)]
    cleaned = cleaned.drop_duplicates(subset=["id"])
    return cleaned.sort_values("totalMarks").reset_index(drop=True)


def dominant_neighbor_grade(frame: pd.DataFrame, current_index: int, window_size: int = 5) -> int:
    """Look at nearby rows to estimate what grade is most common around this mark."""
    start = max(0, current_index - window_size)
    end = min(len(frame), current_index + window_size + 1)
    neighborhood = frame.iloc[start:end]

    if neighborhood.empty:
        return int(frame.iloc[current_index]["normalizedGrade"])

    return int(neighborhood["normalizedGrade"].mode().iloc[0])


def flag_conflicts(frame: pd.DataFrame) -> pd.DataFrame:
    """Mark rows that clash with local grade patterns or repeated-mark conflicts."""
    if frame.empty:
        frame["is_suspicious"] = []
        frame["cleaning_reason"] = []
        frame["confidence_hint"] = []
        return frame

    suspicious_rows: List[bool] = []
    reasons: List[str] = []
    confidence_hints: List[float] = []

    mark_grade_counts = frame.groupby("totalMarks")["normalizedGrade"].nunique().to_dict()

    for index, row in frame.iterrows():
        neighbor_grade = dominant_neighbor_grade(frame, index)
        same_mark_conflict = mark_grade_counts.get(row["totalMarks"], 1) > 1
        large_grade_gap = abs(int(row["normalizedGrade"]) - neighbor_grade) >= 2

        is_suspicious = same_mark_conflict and large_grade_gap
        if is_suspicious:
            reason = (
                f"Same marks have conflicting grades. Local pattern suggests grade {neighbor_grade}, "
                f"but this row reports {int(row['normalizedGrade'])}."
            )
        elif same_mark_conflict:
            reason = "Same marks appear with multiple grades, so this row should be reviewed."
        else:
            reason = ""

        distance_penalty = abs(int(row["normalizedGrade"]) - neighbor_grade) * 12
        confidence_hint = max(35.0, 96.0 - distance_penalty - (10 if same_mark_conflict else 0))

        suspicious_rows.append(is_suspicious or same_mark_conflict)
        reasons.append(reason)
        confidence_hints.append(round(confidence_hint, 2))

    frame["is_suspicious"] = suspicious_rows
    frame["cleaning_reason"] = reasons
    frame["confidence_hint"] = confidence_hints
    return frame


def estimate_cutoffs(frame: pd.DataFrame) -> List[Dict]:
    """
    Estimate the lower boundary for each grade.

    Why this method is beginner-friendly:
    1. We use accepted rows only.
    2. The lower 15th percentile gives a stable estimate for the minimum mark usually seen for a grade.
    3. We compare that grade to the best marks in lower grades to measure boundary separation.
    """
    results: List[Dict] = []
    accepted = frame[~frame["is_suspicious"]].copy()

    if accepted.empty:
        return results

    for grade_value in sorted(ALLOWED_GRADES, reverse=True):
        grade_rows = accepted[accepted["normalizedGrade"] == grade_value]
        lower_grade_rows = accepted[accepted["normalizedGrade"] < grade_value]

        if grade_rows.empty:
            continue

        estimated_lower_mark = float(np.percentile(grade_rows["totalMarks"], 15))
        highest_below_mark = (
            float(lower_grade_rows["totalMarks"].max()) if not lower_grade_rows.empty else None
        )

        separation = 4.0
        if highest_below_mark is not None:
            separation = max(0.0, estimated_lower_mark - highest_below_mark)

        sample_factor = min(1.0, len(grade_rows) / 15)
        separation_factor = min(1.0, separation / 8)
        confidence_score = round((0.65 * sample_factor + 0.35 * separation_factor) * 100, 2)

        results.append(
            {
                "grade_value": grade_value,
                "estimated_lower_mark": round(estimated_lower_mark, 2),
                "highest_below_mark": round(highest_below_mark, 2) if highest_below_mark is not None else None,
                "confidence_score": confidence_score,
                "sample_size": int(len(grade_rows)),
            }
        )

    return results


def build_flagged_entries(frame: pd.DataFrame) -> List[Dict]:
    flagged = frame[frame["is_suspicious"]].copy()
    entries: List[Dict] = []

    for _, row in flagged.iterrows():
        entries.append(
            {
                "id": row["id"],
                "reason": row["cleaning_reason"] or "Submission deviates from neighboring grade pattern.",
                "severity": "medium" if row["confidence_hint"] >= 70 else "high",
                "details": {
                    "marks": float(row["totalMarks"]),
                    "grade": int(row["normalizedGrade"]),
                    "confidence_hint": float(row["confidence_hint"]),
                },
            }
        )

    return entries


def main() -> None:
    payload = load_payload()
    submissions = payload.get("submissions", [])
    frame = pd.DataFrame(submissions)

    cleaned = remove_invalid_rows(frame)
    cleaned = flag_conflicts(cleaned)

    result = {
        "course": payload.get("course", {}),
        "cleaned_submissions": [
            {
                "id": row["id"],
                "cleaned_marks": round(float(row["totalMarks"]), 2),
                "cleaned_grade": int(row["normalizedGrade"]),
                "is_suspicious": bool(row["is_suspicious"]),
                "cleaning_reason": row["cleaning_reason"],
                "confidence_hint": float(row["confidence_hint"]),
            }
            for _, row in cleaned.iterrows()
        ],
        "flagged_entries": build_flagged_entries(cleaned),
        "estimated_cutoffs": estimate_cutoffs(cleaned),
    }

    sys.stdout.write(json.dumps(result))


if __name__ == "__main__":
    main()
