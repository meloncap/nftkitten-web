import { FC } from "react";
import { useQuery } from "react-query";
import { StateSelector } from "zustand";
import { useStore } from "../store";

const apiBaseUrlSelector: StateSelector<StoreState, string> = (x) => x.apiBaseUrl;

export const CollectionPanel: FC = () => {
   const apiBaseUrl = useStore(apiBaseUrlSelector);
   const { isSuccess, data } = useQuery("data", () =>
      fetch(`${apiBaseUrl}graphql`, {
         method: "POST",
         body: JSON.stringify({
            query: `
  collection {
    id
    data
  }
`,
         }),
      })
         .then((res) => res.json())
         .then((res) => res.data)
   );
   return (
      <div>
         {isSuccess && (
            <div className="grid grid-cols-4 gap-4">
               {JSON.stringify(data)}
            </div>
         )}
      </div>
   );
};
