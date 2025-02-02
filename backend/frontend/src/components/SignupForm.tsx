import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { useSetRecoilState } from "recoil";
import authScreenAtom from "@/atoms/authAtom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import userAtom from "@/atoms/userAtom";
import { BASE_URL } from "@/lib/config";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  password: string;
  username: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  username?: string;
}

export function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();
  const baseUrl = BASE_URL;
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Username validation: must be lowercase and may include optional numbers
    if (!/^[a-z]+[0-9]*$/.test(formData.username)) {
      newErrors.username =
        "Username must be lowercase letters and may include optional numbers";
    } else if (formData.username.length < 2) {
      newErrors.username = "Username must be at least 2 characters";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Simulating an API call
        const res = await fetch(`${baseUrl}/api/users/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        });
        const data = await res.json();

        if (data.error) {
          toast.error(data.error);
          return;
        }
        localStorage.setItem("user-data", JSON.stringify(data));
        setUser(data);
        toast.success("Signup successful");
        navigate("/");
      } catch (error) {
        console.error("Signup error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                placeholder="Name"
                onChange={handleChange}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  className="pe-9"
                  placeholder="Password"
                  value={formData.password}
                  required
                  onChange={handleChange}
                  type={isVisible ? "text" : "password"}
                />
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  aria-pressed={isVisible}
                  aria-controls="password"
                >
                  {isVisible ? (
                    <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Eye size={16} strokeWidth={2} aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <p className="flex items-center gap-2">
                  <Loader2 className="size-4 shrink-0 animate-spin" />
                  Signing up...
                </p>
              ) : (
                "Sign Up"
              )}
            </Button>

            <p className="text-center">
              Already have an account?{" "}
              <span
                onClick={() => setAuthScreen("login")}
                className="cursor-pointer underline font-semibold fo"
              >
                Login
              </span>
              .
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
