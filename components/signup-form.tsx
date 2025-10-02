"use client";

import { useState, FormEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { WaitlistFormData, FormErrors } from "@/types/waitlist";

export function SignupForm() {
  const [formData, setFormData] = useState<WaitlistFormData>({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setSubmitMessage(data.message || "Successfully joined the waitlist!");
        setFormData({ email: "", firstName: "", lastName: "" });
        setErrors({});
      } else {
        setSubmitStatus("error");
        setSubmitMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof WaitlistFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-1">
        <Input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          aria-invalid={!!errors.firstName}
          disabled={isSubmitting}
        />
        {errors.firstName && (
          <p className="text-red-500 text-xs font-mono pl-4">{errors.firstName}</p>
        )}
      </div>

      <div className="space-y-1">
        <Input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          aria-invalid={!!errors.lastName}
          disabled={isSubmitting}
        />
        {errors.lastName && (
          <p className="text-red-500 text-xs font-mono pl-4">{errors.lastName}</p>
        )}
      </div>

      <div className="space-y-1">
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          aria-invalid={!!errors.email}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-red-500 text-xs font-mono pl-4">{errors.email}</p>
        )}
      </div>

      <Button
        type="submit"
        size="default"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "[Joining...]" : "[Join the Waitlist]"}
      </Button>

      {submitStatus === "success" && (
        <p className="text-primary text-sm font-mono text-center mt-4">
          {submitMessage}
        </p>
      )}

      {submitStatus === "error" && (
        <p className="text-red-500 text-sm font-mono text-center mt-4">
          {submitMessage}
        </p>
      )}
    </form>
  );
}
