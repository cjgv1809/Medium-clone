import Head from "next/head"
import Banner from "../components/Banner"
import Header from "../components/Header"
import Posts from "../components/Posts"
import { sanityClient } from "../sanity"
import { Post } from "../typings"

interface Props {
  posts: Post[];
}

export default function Home({posts}: Props) {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Banner />
      <Posts posts={posts} />
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"] {
    _id, 
    title, 
    author -> {
    name, 
    image
  },
    description,
    mainImage,
    slug
  }`;

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    }
  }
}
