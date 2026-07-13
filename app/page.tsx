import timelineData from "../data/openai-product-timeline-v0.1.json";
import { TimelineExplorer, type Dataset, type InitialFilters } from "./timeline-explorer";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const data = timelineData as unknown as Dataset;
  const requestedFamily = first(params.family);
  const requestedYear = first(params.year);
  const requestedEvent = first(params.event);
  const initialFilters: InitialFilters = {
    query: first(params.q),
    family: data.taxonomy.some((item) => item.id === requestedFamily) ? requestedFamily : "all",
    year: data.events.some((event) => String(event.year) === requestedYear) ? requestedYear : "all",
    landmarksOnly: first(params.landmarks) === "1",
    selectedId: data.events.some((event) => event.event_id === requestedEvent) ? requestedEvent : data.events[0]?.event_id ?? "",
  };

  return <TimelineExplorer initialData={data} initialFilters={initialFilters} />;
}
