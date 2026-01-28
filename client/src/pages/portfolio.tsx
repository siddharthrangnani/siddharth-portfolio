import { useMemo, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type Project = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  details: string[];
  linkLabel: string;
  linkHref: string;
};

const navItems = [
  { id: "home", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "tech", label: "Skills" },
  { id: "certifications", label: "Certifications" },
  { id: "education", label: "Education" },
] as const;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function SectionHeading(props: {
  eyebrow: string;
  title: string;
  description?: string;
  testIdTitle: string;
}) {
  return (
    <motion.div 
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="mx-auto max-w-2xl text-center"
    >
      <p
        className="inline-flex items-center gap-2 rounded-full border bg-card/50 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur"
        data-testid={`text-eyebrow-${props.eyebrow.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        {props.eyebrow}
      </p>
      <h2
        className="mt-4 font-serif text-3xl tracking-tight sm:text-4xl"
        data-testid={props.testIdTitle}
      >
        {props.title}
      </h2>
      {props.description ? (
        <p
          className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
          data-testid={`text-section-desc-${props.title.replace(/\s+/g, "-").toLowerCase()}`}
        >
          {props.description}
        </p>
      ) : null}
    </motion.div>
  );
}

function Pill(props: { label: string; testId: string }) {
  return (
    <motion.span
      variants={fadeIn}
      className="inline-flex items-center rounded-full border bg-card/70 px-3 py-1 text-sm text-foreground/90 shadow-sm"
      data-testid={props.testId}
    >
      {props.label}
    </motion.span>
  );
}

function ProjectCard(props: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  const p = props.project;
  return (
    <motion.button
      variants={fadeIn}
      whileHover={{ y: -5 }}
      type="button"
      onClick={() => props.onOpen(p)}
      className="group relative w-full h-full text-left flex flex-col"
      data-testid={`button-open-project-${p.id}`}
    >
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-primary/35 via-accent/25 to-transparent opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
      <Card className="relative flex-1 flex flex-col overflow-hidden rounded-3xl border bg-card/70 p-6 shadow-sm backdrop-blur transition-all duration-300 group-hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-xs font-semibold text-muted-foreground"
              data-testid={`text-project-subtitle-${p.id}`}
            >
              {p.subtitle}
            </p>
            <h3
              className="mt-1 text-lg font-semibold tracking-tight"
              data-testid={`text-project-title-${p.id}`}
            >
              {p.title}
            </h3>
          </div>
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background/60 shadow-sm shrink-0"
            aria-hidden="true"
            data-testid={`icon-project-arrow-${p.id}`}
          >
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <p
          className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3"
          data-testid={`text-project-summary-${p.id}`}
        >
          {p.summary}
        </p>

        <div className="mt-auto pt-4 flex flex-wrap gap-2" data-testid={`list-project-tags-${p.id}`}>
          {p.tags.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="rounded-full"
              data-testid={`badge-project-tag-${p.id}-${t.replace(/\s+/g, "-").toLowerCase()}`}
            >
              {t}
            </Badge>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="card-sheen absolute inset-0" />
          <div className="noise absolute inset-0" />
        </div>
      </Card>
    </motion.button>
  );
}

export default function Portfolio() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: ContactFormValues) {
    console.log("Form submitted:", values);
    setIsSubmitted(true);
    toast({
      title: "Success!",
      description: "Message sent successfully",
    });
    form.reset();
    setTimeout(() => setIsSubmitted(false), 5000);
  }

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const projects = useMemo<Project[]>(
    () => [
      {
        id: "pm-dashboard",
        title: "Product Metrics Dashboard",
        subtitle: "Demo project",
        summary:
          "A clean dashboard concept for KPI tracking with smart grouping, filters, and weekly trends.",
        tags: ["Product", "Analytics", "UI"],
        details: [
          "Defined KPI hierarchy (North Star → inputs → diagnostic metrics).",
          "Designed weekly review flow and lightweight annotations for insights.",
          "Built responsive cards and modal deep-dive layout.",
        ],
        linkLabel: "View prototype link",
        linkHref: "https://example.com",
      },
      {
        id: "wireframe-kit",
        title: "Wireframing Kit",
        subtitle: "Demo project",
        summary:
          "A reusable set of components and layouts for fast iteration on product flows and onboarding.",
        tags: ["Wireframing", "UX", "Components"],
        details: [
          "Created modular templates for onboarding, settings, and empty states.",
          "Focused on consistent spacing + typography scale.",
          "Added interaction states to feel real (hover, focus, transitions).",
        ],
        linkLabel: "Open case study",
        linkHref: "https://example.com",
      },
      {
        id: "feedback-loop",
        title: "Customer Feedback Loop",
        subtitle: "Demo project",
        summary:
          "A concept for capturing feedback, tagging themes, and converting insights into roadmap candidates.",
        tags: ["Product Sense", "Research", "Roadmap"],
        details: [
          "Designed tagging + theme clustering for faster synthesis.",
          "Added a simple prioritization view (impact vs. effort).",
          "Structured notes into decisions and follow-ups.",
        ],
        linkLabel: "See more",
        linkHref: "https://example.com",
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute left-1/2 top-[-220px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-260px] right-[-140px] h-[620px] w-[620px] rounded-full bg-accent/10 blur-3xl" />
        <div className="noise absolute inset-0 opacity-40" />
      </div>

      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            type="button"
            onClick={() => scrollToId("home")}
            className="group inline-flex items-center gap-2"
            data-testid="button-nav-brand"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border bg-card/70 shadow-sm">
              <span className="font-serif text-lg" aria-hidden="true">
                S
              </span>
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:block" data-testid="text-brand-name">
              Siddharth Rangnani
            </span>
          </motion.button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navItems.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                type="button"
                onClick={() => scrollToId(item.id)}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
                data-testid={`button-nav-${item.id}`}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={() => scrollToId("contact")}
              data-testid="button-nav-contact"
            >
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              Contact
            </Button>
          </motion.div>
        </div>
      </header>

      <main>
        <section id="home" className="scroll-mt-24" aria-label="Home">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pb-16 sm:pt-16">
            <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1"
              >
                <p
                  className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur"
                  data-testid="text-hero-badge"
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  Portfolio
                </p>

                <h1
                  className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl lg:text-7xl"
                  data-testid="text-hero-name"
                >
                  <span className="text-gradient leading-tight">Siddharth Rangnani</span>
                </h1>

                <p
                  className="mt-3 text-xl font-semibold text-foreground/90 sm:text-2xl"
                  data-testid="text-hero-title"
                >
                  Aspiring PM
                </p>

                <p
                  className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-lg"
                  data-testid="text-hero-summary"
                >
                  I build product thinking into clear, structured experiences — from problem framing and research to wireframes,
                  metrics, and iteration.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-card hover:scale-105"
                    data-testid="link-github"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-card hover:scale-105"
                    data-testid="link-linkedin"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden="true" />
                    LinkedIn
                  </a>

                  <Button className="rounded-full px-6 py-5 h-auto text-base" data-testid="button-download-cv">
                    <Download className="mr-2 h-5 w-5" aria-hidden="true" />
                    Download/view CV
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="experience" className="scroll-mt-24" aria-label="Experience">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <SectionHeading
              eyebrow="Experience"
              title="Where I’ve worked"
              description="Roles and internships that shaped my product + engineering perspective."
              testIdTitle="text-section-experience"
            />

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="mx-auto mt-12 grid max-w-3xl gap-6" 
              data-testid="list-experience"
            >
              <motion.div variants={fadeIn}>
                <Card className="rounded-3xl border bg-card/70 p-8 shadow-sm backdrop-blur hover:bg-card/80 transition-colors" data-testid="card-experience-crest">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-bold" data-testid="text-company-crest">
                        Crest Data
                      </p>
                      <p className="text-sm font-medium text-primary" data-testid="text-role-crest">
                        Project Experience
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full" data-testid="text-date-crest">
                      Nov 2023 – Dec 2025
                    </p>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card
                  className="rounded-3xl border bg-card/70 p-8 shadow-sm backdrop-blur hover:bg-card/80 transition-colors"
                  data-testid="card-experience-cactus"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-bold" data-testid="text-company-cactus">
                        Cactus Communications
                      </p>
                      <p className="text-sm font-medium text-primary" data-testid="text-role-cactus">
                        Product Intern
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full" data-testid="text-date-cactus">
                      June 2023 – August 2023
                    </p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="projects" className="scroll-mt-24" aria-label="Projects">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <SectionHeading
              eyebrow="Projects"
              title="Selected work"
              description="Clickable cards with details — open any project to see notes + a link."
              testIdTitle="text-section-projects"
            />

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
              data-testid="grid-projects"
            >
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} onOpen={setActiveProject} />
              ))}
            </motion.div>

            <AnimatePresence>
              {activeProject && (
                <Dialog open={!!activeProject} onOpenChange={(open) => (!open ? setActiveProject(null) : null)}>
                  <DialogContent className="max-w-2xl rounded-[2rem] p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-white/10" data-testid="modal-project">
                    <div className="relative p-8 pt-10">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-serif" data-testid="text-modal-project-title">{activeProject.title}</DialogTitle>
                      </DialogHeader>

                      <div className="mt-6 space-y-6">
                        <p className="text-base text-muted-foreground leading-relaxed" data-testid="text-modal-project-summary">
                          {activeProject.summary}
                        </p>

                        <div className="flex flex-wrap gap-2" data-testid="list-modal-project-tags">
                          {activeProject.tags.map((t) => (
                            <Badge
                              key={t}
                              variant="secondary"
                              className="rounded-full px-3 py-1"
                              data-testid={`badge-modal-tag-${t.replace(/\s+/g, "-").toLowerCase()}`}
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>

                        <div className="rounded-3xl border border-white/5 bg-white/5 p-6" data-testid="panel-modal-project-details">
                          <p className="text-sm font-bold uppercase tracking-wider text-primary" data-testid="text-modal-details-heading">
                            Key Details
                          </p>
                          <ul className="mt-4 space-y-3" data-testid="list-modal-details">
                            {activeProject.details.map((d, idx) => (
                              <li key={idx} className="flex gap-3 text-sm text-muted-foreground" data-testid={`text-modal-detail-${idx}`}>
                                <Sparkles className="h-4 w-4 shrink-0 text-primary/60" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <Button
                            asChild
                            size="lg"
                            className="rounded-full px-8"
                            data-testid="link-project-external"
                          >
                            <a
                              href={activeProject.linkHref}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {activeProject.linkLabel}
                              <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full border-white/10"
                            onClick={() => setActiveProject(null)}
                            data-testid="button-close-project"
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                      <div className="noise absolute inset-0 opacity-20 pointer-events-none" />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section id="tech" className="scroll-mt-24" aria-label="Skills">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <SectionHeading
              eyebrow="Skills"
              title="Tools & skills"
              description="A mix of product fundamentals and hands-on engineering." 
              testIdTitle="text-section-tech"
            />

            <div className="mx-auto mt-12 max-w-4xl" data-testid="list-tech">
              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-3"
              >
                {[
                  "Product Management",
                  "Product Sense",
                  "Product improvement",
                  "Wireframing",
                  "Google Analytics",
                  "ReactJS",
                  "JavaScript",
                  "NodeJS",
                  "Python",
                  "FASTAPI",
                  "MongoDB",
                  "Docker",
                  "Kubernetes",
                ].map((t, i) => (
                  <Pill key={t} label={t} testId={`pill-tech-${i}`} />
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section id="certifications" className="scroll-mt-24" aria-label="Certifications">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <SectionHeading
              eyebrow="Credentials"
              title="Certifications"
              description="Professional certifications and learning milestones."
              testIdTitle="text-section-certifications"
            />

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="mx-auto mt-12 grid max-w-3xl gap-6"
              data-testid="list-certifications"
            >
              {[
                { title: "Product Management Professional (PMP)", issuer: "Institute of Product", link: "https://example.com" },
                { title: "Advanced Google Analytics", issuer: "Google", link: "https://example.com" },
                { title: "Certified Product Manager", issuer: "AIPMM", link: "https://example.com" },
              ].map((cert, i) => (
                <motion.div key={i} variants={fadeIn}>
                  <a href={cert.link} target="_blank" rel="noreferrer" className="block group">
                    <Card className="rounded-3xl border bg-card/70 p-6 shadow-sm backdrop-blur transition-all duration-300 group-hover:bg-card/90 group-hover:border-primary/30">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-lg font-bold group-hover:text-primary transition-colors">{cert.title}</p>
                          <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        </div>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-background/60 shadow-sm transition-transform group-hover:rotate-12">
                          <ArrowUpRight className="h-5 w-5" />
                        </span>
                      </div>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="education" className="scroll-mt-24" aria-label="Education">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <SectionHeading
              eyebrow="Education"
              title="Academic background"
              description="Where I studied and what I focused on."
              testIdTitle="text-section-education"
            />

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="mx-auto mt-12 grid max-w-3xl gap-6" 
              data-testid="list-education"
            >
              <motion.div variants={fadeIn}>
                <Card className="rounded-3xl border bg-card/70 p-8 shadow-sm backdrop-blur" data-testid="card-edu-nirma">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-bold" data-testid="text-edu-school-nirma">
                        Nirma University, Ahmedabad
                      </p>
                      <p className="text-sm font-medium text-primary" data-testid="text-edu-degree-nirma">
                        BTech in Computer Science
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full" data-testid="text-edu-date-nirma">
                      2021 – 2024
                    </p>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="rounded-3xl border bg-card/70 p-8 shadow-sm backdrop-blur" data-testid="card-edu-gtu">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-bold" data-testid="text-edu-school-gtu">
                        Gujarat Technological University
                      </p>
                      <p className="text-sm font-medium text-primary" data-testid="text-edu-degree-gtu">
                        Diploma in Computer Science
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full" data-testid="text-edu-date-gtu">
                      2018 – 2021
                    </p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24" aria-label="Contact">
          <div className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-20">
            <SectionHeading
              eyebrow="Contact"
              title="Contact me"
              description="Send a message — I’ll get back to you as soon as I can." 
              testIdTitle="text-section-contact"
            />

            <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2" data-testid="grid-contact">
              <motion.div 
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Card className="rounded-3xl border bg-card/70 p-8 shadow-sm backdrop-blur h-full" data-testid="card-contact-info">
                  <p className="text-xl font-bold" data-testid="text-contact-heading">
                    Let’s talk
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground" data-testid="text-contact-copy">
                    If you’re hiring for Product roles or want to collaborate, feel free to reach out. I'm always open to discussing new opportunities and interesting projects.
                  </p>

                  <div className="mt-8 space-y-6">
                    <div className="flex items-center gap-4" data-testid="row-contact-email">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground" data-testid="text-contact-email-label">
                          Email
                        </p>
                        <p className="text-base font-semibold" data-testid="text-contact-email-value">
                          your.email@example.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4" data-testid="row-contact-social">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border bg-accent/10 text-accent">
                        <Linkedin className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground" data-testid="text-contact-social-label">
                          Social
                        </p>
                        <p className="text-base font-semibold" data-testid="text-contact-social-value">
                          GitHub • LinkedIn
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div 
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Card className="rounded-3xl border bg-card/70 p-8 shadow-sm backdrop-blur" data-testid="card-contact-form">
                  <AnimatePresence mode="wait">
                    {isSubmitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                        data-testid="status-success"
                      >
                        <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                          <CheckCircle2 className="h-12 w-12" />
                        </div>
                        <h3 className="text-xl font-bold">Message sent successfully</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Thank you for reaching out. I'll get back to you shortly!
                        </p>
                        <Button
                          variant="ghost"
                          className="mt-6"
                          onClick={() => setIsSubmitted(false)}
                        >
                          Send another message
                        </Button>
                      </motion.div>
                    ) : (
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-6"
                          data-testid="form-contact"
                        >
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-bold">Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your name"
                                    className="rounded-2xl h-12 border-white/10 bg-muted/30 focus:bg-muted/50"
                                    data-testid="input-name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-bold">Email</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="rounded-2xl h-12 border-white/10 bg-muted/30 focus:bg-muted/50"
                                    data-testid="input-email"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-bold">Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Write your message..."
                                    className="min-h-[160px] rounded-2xl border-white/10 bg-muted/30 focus:bg-muted/50 resize-none"
                                    data-testid="input-message"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button 
                            type="submit" 
                            disabled={form.formState.isSubmitting}
                            className="w-full rounded-2xl h-14 text-base font-bold shadow-lg shadow-primary/20" 
                            data-testid="button-submit"
                          >
                            {form.formState.isSubmitting ? "Sending..." : "Send message"}
                          </Button>
                        </form>
                      </Form>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background/60 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border bg-card/70 shadow-sm">
                <span className="font-serif text-base" aria-hidden="true">
                  S
                </span>
              </span>
              <span className="text-sm font-bold tracking-tight">Siddharth Rangnani</span>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-footer">
              © {new Date().getFullYear()} Siddharth Rangnani. Built with React & Framer Motion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
