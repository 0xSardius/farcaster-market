import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TestPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Neobrutalism Test</h1>

      <Button>Test Button</Button>
      <Button variant="neutral">Secondary Button</Button>

      <Card className="w-96">
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Test input" />
        </CardContent>
      </Card>
    </div>
  );
}
