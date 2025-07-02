import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  features: string[];
  price?: string;
}

export default function ServiceCard({
  title,
  description,
  icon: Icon,
  href,
  features,
  price,
}: ServiceCardProps) {
  return (
    <Card className="h-full transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-100">
          <Icon className="h-6 w-6 text-medical-600" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-medical-500" />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        {price && (
          <div className="mt-4 text-2xl font-bold text-medical-600">
            {price}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={href} className="flex items-center justify-center">
            Tìm hiểu thêm
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
