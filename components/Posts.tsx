import { Post } from "../typings";
import { urlFor } from "../sanity";
import Link from "next/link";

interface Props {
  posts: Post[];
}

function Posts( {posts}: Props): JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
    {posts.map(post => (
      <Link key={post._id} href={`/post/${post.slug.current}`}>
        <div className="group cursor-pointer border rounded-xl overflow-hidden">
          {/* Its a protecting form ! to indicate that that value is not null */}
          <img className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out" src={urlFor(post.mainImage).url()!} alt="" loading="lazy" />
          <div className="flex justify-between p-5 bg-white">
            <div>
              <p className="text-lg font-bold">{post.title}</p>
              <p className="text-xs">{post.description} by {post.author.name}</p>
            </div>

            <img src={urlFor(post.author.image).url()!} alt="" className="h-12 w-12 rounded-full object-contain" loading="lazy"/>
          </div>
        </div>
      </Link>
    ))}
  </div>
  )
}

export default Posts;
