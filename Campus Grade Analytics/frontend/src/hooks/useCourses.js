import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await api.get("/courses");
        setCourses(response.data.courses);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return { courses, loading, error };
}

