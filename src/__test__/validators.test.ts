import {
  createHabitSchema,
  loginSchema,
  registerSchema,
} from "@/lib/validators";

describe("registerSchema", () => {
  it("accepts valid credentials", () => {
    const result = registerSchema.safeParse({
      email: "test@gmail.com",
      password: "Password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      email: "invalid-email",
      password: "Password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects weak password", () => {
    const result = registerSchema.safeParse({
      email: "test@gmail.com",
      password: "weak",
    });

    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: "test@gmail.com",
      password: "123456",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "test@gmail.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("createHabitSchema", () => {
  it("accepts valid habit", () => {
    const result = createHabitSchema.safeParse({
      title: "Read books",
      description: "10 pages daily",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = createHabitSchema.safeParse({
      title: "",
      description: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects too long title", () => {
    const result = createHabitSchema.safeParse({
      title: "a".repeat(101),
      description: "desc",
    });

    expect(result.success).toBe(false);
  });
});
