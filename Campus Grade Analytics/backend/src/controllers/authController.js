import { signup, login } from "../services/authService.js";

export async function signupController(req, res) {
  const result = await signup(req.body);
  res.status(201).json({ success: true, ...result });
}

export async function loginController(req, res) {
  const result = await login(req.body);
  res.json({ success: true, ...result });
}

export async function meController(req, res) {
  res.json({ success: true, user: req.user });
}

