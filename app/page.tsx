import timelineData from "../data/openai-product-timeline-v0.1.json";
import { TimelineGame } from "../components/timeline-game/TimelineGame";
import { normalizeTimelineViewState } from "../lib/timeline/search-index";
import { prepareExplorerDataset, type TimelineDataset } from "../lib/timeline/schema";
import { parseTimelineViewState } from "../lib/timeline/view-state";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const data = prepareExplorerDataset(timelineData as unknown as TimelineDataset);
  const initialView = normalizeTimelineViewState(parseTimelineViewState(params, data), data);
  const rawEvent = Array.isArray(params.event) ? params.event[0] : params.event;
  const initialRouteId = rawEvent && data.events.some((event) => event.event_id === rawEvent)
    ? rawEvent
    : undefined;

  return <TimelineGame initialData={data} initialView={initialView} initialRouteId={initialRouteId} />;
}
