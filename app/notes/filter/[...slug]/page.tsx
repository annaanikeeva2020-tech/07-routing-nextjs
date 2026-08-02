import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { notFound } from 'next/navigation';

const validTags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

interface NotesPageProps {
  params: Promise<{slug: string[];}>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;

  const rawTag = slug[0];
  if (rawTag !== 'all' && !validTags.includes(rawTag)) {
    notFound();
  }
  
  const currentTag = slug[0] === "all" ? undefined : slug[0];

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", currentTag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        search: "",
        tag: currentTag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={currentTag} />
    </HydrationBoundary>
  );
}