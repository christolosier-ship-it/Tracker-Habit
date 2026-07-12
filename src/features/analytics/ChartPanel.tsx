import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

type ChartPanelProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function ChartPanel({
  title,
  description,
  children,
}: ChartPanelProps) {
  return (
    <Card className="chart-card chart-panel">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
