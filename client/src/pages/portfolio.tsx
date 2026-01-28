import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

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
  { id: "tech", label: "Tech Stack" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact me" },
] as const;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionHeading(props: {
  eyebrow: string;
  title: string;
  description?: string;
  testIdTitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
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
    </div>
  );
}

function Pill(props: { label: string; testId: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border bg-card/70 px-3 py-1 text-sm text-foreground/90 shadow-sm"
      data-testid={props.testId}
    >
      {props.label}
    </span>
  );
}

function ProjectCard(props: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  const p = props.project;
  return (
    <button
      type="button"
      onClick={() => props.onOpen(p)}
      className="group relative w-full text-left"
      data-testid={`button-open-project-${p.id}`}
    >
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-primary/35 via-accent/25 to-transparent opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
      <Card className="relative overflow-hidden rounded-3xl border bg-card/70 p-6 shadow-sm backdrop-blur transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background/60 shadow-sm"
            aria-hidden="true"
            data-testid={`icon-project-arrow-${p.id}`}
          >
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <p
          className="mt-3 text-sm leading-relaxed text-muted-foreground"
          data-testid={`text-project-summary-${p.id}`}
        >
          {p.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2" data-testid={`list-project-tags-${p.id}`}>
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
    </button>
  );
}

export default function Portfolio() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/18 blur-3xl" />
        <div className="absolute bottom-[-260px] right-[-140px] h-[520px] w-[520px] rounded-full bg-accent/18 blur-3xl" />
        <div className="noise absolute inset-0 opacity-60" />
      </div>

      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
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
          </button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToId(item.id)}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                data-testid={`button-nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={() => scrollToId("contact")}
              data-testid="button-nav-contact"
            >
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              Contact
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="scroll-mt-24" aria-label="Home">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pb-16 sm:pt-16">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <p
                  className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur"
                  data-testid="text-hero-badge"
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  Portfolio
                </p>

                <h1
                  className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl lg:text-6xl"
                  data-testid="text-hero-name"
                >
                  <span className="text-gradient">Siddharth Rangnani</span>
                </h1>

                <p
                  className="mt-3 text-lg font-semibold text-foreground/90 sm:text-xl"
                  data-testid="text-hero-title"
                >
                  Aspiring PM
                </p>

                <p
                  className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
                  data-testid="text-hero-summary"
                >
                  I build product thinking into clear, structured experiences — from problem framing and research to wireframes,
                  metrics, and iteration.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-card"
                    data-testid="link-github"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-card"
                    data-testid="link-linkedin"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden="true" />
                    LinkedIn
                  </a>

                  <Button className="rounded-full" data-testid="button-download-cv">
                    <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                    Download/view CV
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-2 rounded-[2.25rem] bg-gradient-to-r from-primary/25 via-accent/20 to-transparent blur-xl" />
                <div
                  className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.25rem] border bg-card/60 shadow-sm backdrop-blur"
                  data-testid="img-profile-placeholder"
                >
                  <div className="absolute inset-0 grid place-items-center p-8">
                    <div className="text-center">
                      <p className="text-sm font-semibold" data-testid="text-photo-placeholder-title">
                        Your photo goes here
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground" data-testid="text-photo-placeholder-subtitle">
                        Replace this placeholder with your image later.
                      </p>
                    </div>
                  </div>
                  <div className="noise absolute inset-0 opacity-40" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="scroll-mt-24" aria-label="Experience">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18">
            <SectionHeading
              eyebrow="Experience"
              title="Where I’ve worked"
              description="Roles and internships that shaped my product + engineering perspective."
              testIdTitle="text-section-experience"
            />

            <div className="mx-auto mt-10 grid max-w-3xl gap-4" data-testid="list-experience">
              <Card className="rounded-3xl border bg-card/70 p-6 shadow-sm backdrop-blur" data-testid="card-experience-crest">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold" data-testid="text-company-crest">
                      Crest Data
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid="text-role-crest">
                      Experience
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground" data-testid="text-date-crest">
                    Nov 2023 – Dec 2025
                  </p>
                </div>
              </Card>

              <Card
                className="rounded-3xl border bg-card/70 p-6 shadow-sm backdrop-blur"
                data-testid="card-experience-cactus"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold" data-testid="text-company-cactus">
                      Cactus Communications
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid="text-role-cactus">
                      Internship
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground" data-testid="text-date-cactus">
                    June 2023 – August 2023
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section id="projects" className="scroll-mt-24" aria-label="Projects">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18">
            <SectionHeading
              eyebrow="Projects"
              title="Selected work"
              description="Clickable cards with details — open any project to see notes + a link."
              testIdTitle="text-section-projects"
            />

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="grid-projects">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} onOpen={setActiveProject} />
              ))}
            </div>

            <Dialog open={!!activeProject} onOpenChange={(open) => (!open ? setActiveProject(null) : null)}>
              <DialogContent className="max-w-2xl rounded-3xl" data-testid="modal-project">
                {activeProject ? (
                  <>
                    <DialogHeader>
                      <DialogTitle data-testid="text-modal-project-title">{activeProject.title}</DialogTitle>
                    </DialogHeader>

                    <div className="mt-2 space-y-4">
                      <p className="text-sm text-muted-foreground" data-testid="text-modal-project-summary">
                        {activeProject.summary}
                      </p>

                      <div className="flex flex-wrap gap-2" data-testid="list-modal-project-tags">
                        {activeProject.tags.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="rounded-full"
                            data-testid={`badge-modal-tag-${t.replace(/\s+/g, "-").toLowerCase()}`}
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>

                      <div className="rounded-2xl border bg-card/60 p-4" data-testid="panel-modal-project-details">
                        <p className="text-sm font-semibold" data-testid="text-modal-details-heading">
                          Details
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground" data-testid="list-modal-details">
                          {activeProject.details.map((d, idx) => (
                            <li key={idx} data-testid={`text-modal-detail-${idx}`}>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <a
                          href={activeProject.linkHref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-full border bg-background px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-card"
                          data-testid="link-project-external"
                        >
                          {activeProject.linkLabel}
                          <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                        </a>
                        <Button
                          variant="secondary"
                          className="rounded-full"
                          onClick={() => setActiveProject(null)}
                          data-testid="button-close-project"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </>
                ) : null}
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <section id="tech" className="scroll-mt-24" aria-label="Tech Stack">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18">
            <SectionHeading
              eyebrow="Tech stack"
              title="Tools & skills"
              description="A mix of product fundamentals and hands-on engineering." 
              testIdTitle="text-section-tech"
            />

            <div className="mx-auto mt-10 max-w-4xl" data-testid="list-tech">
              <div className="rounded-3xl border bg-card/60 p-6 shadow-sm backdrop-blur">
                <div className="flex flex-wrap gap-2">
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
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="education" className="scroll-mt-24" aria-label="Education">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18">
            <SectionHeading
              eyebrow="Education"
              title="Academic background"
              description="Where I studied and what I focused on."
              testIdTitle="text-section-education"
            />

            <div className="mx-auto mt-10 grid max-w-3xl gap-4" data-testid="list-education">
              <Card className="rounded-3xl border bg-card/70 p-6 shadow-sm backdrop-blur" data-testid="card-edu-nirma">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold" data-testid="text-edu-school-nirma">
                      Nirma University, Ahmedabad
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid="text-edu-degree-nirma">
                      BTech in Computer Science
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground" data-testid="text-edu-date-nirma">
                    2021 – 2024
                  </p>
                </div>
              </Card>

              <Card className="rounded-3xl border bg-card/70 p-6 shadow-sm backdrop-blur" data-testid="card-edu-gtu">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold" data-testid="text-edu-school-gtu">
                      Gujarat Technological University
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid="text-edu-degree-gtu">
                      Diploma in Computer Science
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground" data-testid="text-edu-date-gtu">
                    2018 – 2021
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24" aria-label="Contact">
          <div className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-18">
            <SectionHeading
              eyebrow="Contact"
              title="Contact me"
              description="Send a message — I’ll get back to you as soon as I can." 
              testIdTitle="text-section-contact"
            />

            <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2" data-testid="grid-contact">
              <Card className="rounded-3xl border bg-card/70 p-6 shadow-sm backdrop-blur" data-testid="card-contact-info">
                <p className="text-sm font-semibold" data-testid="text-contact-heading">
                  Let’s talk
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground" data-testid="text-contact-copy">
                  If you’re hiring for Product roles or want to collaborate, feel free to reach out.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3" data-testid="row-contact-email">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-background/60">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground" data-testid="text-contact-email-label">
                        Email
                      </p>
                      <p className="text-sm font-semibold" data-testid="text-contact-email-value">
                        your.email@example.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3" data-testid="row-contact-social">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-background/60">
                      <Github className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground" data-testid="text-contact-social-label">
                        Social
                      </p>
                      <p className="text-sm font-semibold" data-testid="text-contact-social-value">
                        GitHub • LinkedIn
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl border bg-card/70 p-6 shadow-sm backdrop-blur" data-testid="card-contact-form">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-4"
                  data-testid="form-contact"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-semibold" htmlFor="contact-name" data-testid="label-name">
                      Name
                    </label>
                    <Input
                      id="contact-name"
                      placeholder="Your name"
                      className="rounded-2xl"
                      data-testid="input-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold" htmlFor="contact-email" data-testid="label-email">
                      Email
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      className="rounded-2xl"
                      data-testid="input-email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold" htmlFor="contact-message" data-testid="label-message">
                      Message
                    </label>
                    <Textarea
                      id="contact-message"
                      placeholder="Write your message..."
                      className="min-h-[140px] rounded-2xl"
                      data-testid="input-message"
                    />
                  </div>

                  <Button type="submit" className="w-full rounded-2xl" data-testid="button-submit">
                    Send message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="text-sm text-muted-foreground" data-testid="text-footer">
            © {new Date().getFullYear()} Siddharth Rangnani. Built with React.
          </p>
        </div>
      </footer>
    </div>
  );
}
