import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET() {
  const count = await redis.incr("visits");
  return Response.json({ count });
}
