import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Product Endpoints", () => {
  let user1Token: string;
  let user2Token: string;
  let productId: number;

  const user1Email = `seller-${Date.now()}@test.com`;
  const user2Email = `buyer-${Date.now()}@test.com`;
  const password = "123456";

  beforeAll(async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: user1Email, password });
    const login1 = await request(app)
      .post("/auth/login")
      .send({ email: user1Email, password });
    user1Token = login1.body.token;

    await request(app)
      .post("/auth/register")
      .send({ email: user2Email, password });
    const login2 = await request(app)
      .post("/auth/login")
      .send({ email: user2Email, password });
    user2Token = login2.body.token;
  });

  afterAll(async () => {
    await prisma.product.deleteMany({
      where: { seller: { email: { in: [user1Email, user2Email] } } },
    });
    await prisma.user.deleteMany({
      where: { email: { in: [user1Email, user2Email] } },
    });
    await prisma.$disconnect();
  });

  it("should create a product", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({
        title: "Test Ürün",
        description: "Test açıklaması",
        price: 100,
      });

    expect(res.status).toBe(201);
    productId = res.body.id;
  });

  it("should not allow another user to update the product", async () => {
    const res = await request(app)
      .put(`/products/${productId}`)
      .set("Authorization", `Bearer ${user2Token}`)
      .send({ price: 200 });

    expect(res.status).toBe(403);
  });

  it("should allow the owner to update the product", async () => {
    const res = await request(app)
      .put(`/products/${productId}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ price: 200 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(200);
  });
});