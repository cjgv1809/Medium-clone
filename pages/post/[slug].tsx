import { GetStaticProps } from "next";
import Header from "../../components/Header";
import {sanityClient, urlFor} from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

function Post({ post }: Props): JSX.Element {  
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data)
    }).then(() => {
      console.log(data)
      setSubmitted(true)
    }).catch(err => {
      console.log(err)
      setSubmitted(false)
    })
  }

  return (
    <main>
      <Header />
      <img src={urlFor(post.mainImage).url()!} alt="" className="w-full h-60 object-cover" loading="lazy"/>

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">{post.description}</h2>
        
        <div className="flex items-center space-x-3">
          <img src={urlFor(post.author.image).url()!} alt="" className="h-10 w-10 rounded-full" loading="lazy" />
          <p className="font-extralight text-sm">
            Blog post by <span className="text-yellow-500">{post.author.name}</span> - Published at {" "}{new Date(post._createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
          className=""  
          dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
          projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
          content={post.body}
          serializers={{
            h1: (props: any) => (
              <h1 className="text-2xl font-bold my-5" {...props} />
            ),
            h2: (props: any) => (
              <h1 className="text-xl font-bold my-5" {...props} />
            ),
            li: ({children}: any) => (
              <li className="ml-4 list-disc">{children}</li>
            ),
            link: ({href, children}: any) => (
              <a href={href} className="text-blue-500 hover:underline">   {children}
              </a>
            ),
          }}
          />
        </div>
      </article>

      <hr className="max-w-2xl my-5 mx-auto border border-yellow-500" />

      {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">Thank you for submitting your comment!</h3>
          <p>Once it has been approved, it will appear below</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 md:p-0 max-w-2xl mx-auto mb-10">
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2"/>

          <input {...register("_id")} type="hidden" name="_id" value={post._id} />

          <label className="block mb-5">
            <span className="text-gray-700 font-semibold">Name</span>
            <input 
            {...register("name", { required: true })}
            type="text" placeholder="Enter name..." className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"/>
          </label>
          <label className="block mb-5">
            <span className="text-gray-700 font-semibold">Email</span>
            <input 
            {...register("email", { required: true })}
            type="email" placeholder="Enter email..." className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"/>
          </label>
          <label className="block mb-5">
            <span className="text-gray-700 font-semibold">Comment</span>
            <textarea 
            {...register("comment", { required: true })}
            placeholder="Enter comment..." rows={8} className="shadow border rounded py-2 px-3 form-textarea mt-1 w-full block ring-yellow-500 outline-none focus:ring resize-none"/>
          </label>

          {/* errors will return when field validation fails */}
          <div className="flex flex-col py-5">
            {errors.name && (
              <span className="text-red-500">- Name is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">- Email is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">- Comment is required</span>
            )}
          </div>

          <input type="submit" className="shadow bg-yellow-600 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer" value="Submit" />
      </form>
      )}

      {/* Comments */}
      <div className="flex flex-col p-5 md:p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p className="flex justify-evenly">
              <span className="text-yellow-500 mr-2">{(comment.name).split(" ")[0]}</span>
              <span className="text-justify max-w-sm md:max-w-md">{comment.comment}</span>
              <span className="text-[10px] text-gray-500 ml-auto mt-1">{new Date(comment._createdAt).toLocaleString()}</span>
            </p>
          </div>
        ))}
      </div>

    </main>
  )
  ;
}

export default Post;

// To know which page should be rendered
export const getStaticPaths = async () => {
  const query = `*[_type == "post"] {
    _id,
    slug {
    current
    }
  }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current
    }
  }));

  return {
    paths,
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    author -> {
    name, 
    image
  },
  "comments": *[_type == "comment" && post._ref == ^._id && approved == true],
    description,
    mainImage,
    slug,
    body
  }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug
  });

  if(!post) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // after 60 seconds, it will update the old cached version
  }
}
