import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type BlogPost } from "@shared/schema";

export default function Resources() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-48 bg-gray-200 rounded-lg" />
                <div className="h-6 w-3/4 bg-gray-200 rounded mt-4" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mt-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Insurance Resources</h1>
        <p className="mt-2 text-gray-600">
          Learn more about insurance policies and claim processes
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <img
                src={post.imageUrl}
                alt={post.title}
                className="rounded-lg object-cover h-48 w-full"
              />
              <CardTitle className="mt-4">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{post.content}</p>
              <p className="text-sm text-gray-500 mt-4">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
