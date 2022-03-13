import '../styles/globals.css'
import { useQuery } from "react-query";
import type { AppProps } from 'next/app'
import { GetServerSideProps, GetServerSidePropsContext, GetStaticPathsContext } from 'next';

export function MyApp({ Component, pageProps }: AppProps) {
  const { isSuccess, data } = useQuery("data", () =>
    fetch(`${pageProps.apiBaseurl}/graphql`, {
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
  return <Component {...pageProps}>
   {isSuccess && (
        <div className="grid grid-cols-4 gap-4">
          {JSON.stringify(data)}
        </div>
      )}
  </Component>
}

export async function GetStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
       apiBaseurl: process.env.API_BASEURL
    }, // will be passed to the page component as props
  }
}

export default MyApp
