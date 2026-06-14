import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Image as ImageIcon, Waves, Network, Eye, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_protected/app/deep-learning/")({
  component: DeepLearningIndex,
});

const PAGES = [
  { to: "/app/deep-learning/cnn-builder", title: "CNN Builder",
    tagline: "Convolutional networks for images & spectrograms.", icon: ImageIcon },
  { to: "/app/deep-learning/lstm-builder", title: "LSTM Builder",
    tagline: "Sequence models for text, time-series & signals.", icon: Waves },
  { to: "/app/deep-learning/transformer-builder", title: "Transformer Builder",
    tagline: "Encoder / decoder transformers with pretrained backbones.", icon: Network },
  { to: "/app/deep-learning/computer-vision", title: "Computer Vision Builder",
    tagline: "Classification, detection, segmentation pipelines.", icon: Eye },
] as const;

function DeepLearningIndex() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {PAGES.map((p, i) => {
        const Icon = p.icon;
        return (
          <motion.div
            key={p.to}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
          >
            <Link to={p.to} className="block h-full">
              <Card className="group h-full transition-all hover:border-primary/40 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    <span>{p.title}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{p.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Open the tool to upload data and generate architecture + code.
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
