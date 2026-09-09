import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Auth Endpoints", () => {
  const testEmail = `test-${Date.now()}@test.com`;
  const testPassword = "123456";

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(testEmail);
  });

  it("should not register with an existing email", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(409);
  });

  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should not login with wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: testEmail, password: "wrongpassword" });

    expect(res.status).toBe(401);
  });
});