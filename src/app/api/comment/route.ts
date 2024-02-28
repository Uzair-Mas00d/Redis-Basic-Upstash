import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { redis } from "@/lib/redis";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { text, tags } = body;
    const commentId = nanoid();
    const comment = {
      text,
      tags,
      upvotes:0,
      timestamp: new Date(),
      author: req.cookies.get("userId")?.value,
    };

    // await redis.json.numincrby('comment:c1ngGsv7nG', '$.upvotes',1)

    await Promise.all([
      redis.rpush("comments", commentId),
    //   redis.sadd(`tags:${commentId}`, tags),
      redis.json.set(`comment:${commentId}`, "$", comment),
    ]);

    return new Response("OK");
  } catch (error) {
    console.log(error);
  }
};
