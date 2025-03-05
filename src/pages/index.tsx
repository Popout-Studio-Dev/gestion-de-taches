import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Gestion de Tâche</title>
        <meta name="description" content="Hello c'est la team Gestion de Tâche" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "24px" }}>
        Hello c&apos;est la team Gestion de Tâche
      </div>
    </>
  );
}
