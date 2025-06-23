import Video, { IVideo } from "@/app/models/Video";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(videos);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Failed to fetch videos",
      },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const session = getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDatabase();
    const body: IVideo = await request.json();
    if (
      !body.title ||
      !body.description ||
      !body.thumbnailUrl ||
      !body.videoUrl
    ) {
      return NextResponse.json(
        { error: "missing required filed" },
        { status: 400 }
      );
    }
    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality,
      },
    };
    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "failed to create video",
      },
      { status: 500 }
    );
  }
}
