import { PlacesCounts } from "@/widgets/PlacesCounts";
import TypesCards from "@/widgets/TypesCards";
import { TypesCounts } from "@/widgets/TypesCounts";

export default function Home() {
  return (
    <div className="flex gap-2 flex-col md:flex-row md:w-full">
      <div className="flex gap-2 flex-col md:justify-stretch md:w-[30%]">
        <TypesCounts />
        <PlacesCounts />
      </div>
      <TypesCards />
    </div>
  );
}
