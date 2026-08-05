import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { comments } from "@/features/dashboard/data/mock";

export function CommentsCard() {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-slate-900">Comments</h2>
      <ul className="flex flex-col gap-4">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-3">
            <Avatar name={comment.author} size="sm" />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm text-slate-900">
                <span className="font-medium">{comment.author}</span> on{" "}
                <span className="font-medium">{comment.product}</span>
              </p>
              <span className="text-xs text-slate-400">{comment.timestamp}</span>
              <p className="text-sm text-slate-600">{comment.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
