import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Facebook, Github, Globe, Linkedin } from "lucide-react";
import { useI18n } from "@/lib/i18n";

import member1Img from "@/assets/member-1.jpg";
import member2Img from "@/assets/member-2.jpg";
import member3Img from "@/assets/member-3.jpg";
import member4Img from "@/assets/member-4.jpg";
import member5Img from "@/assets/member-5.jpg";

type TeamMember = {
  name: string;
  title: string;
  bio: string;
  img: string;
  portfolioUrl?: string;
  websiteUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  highlight?: boolean;
};

const team: TeamMember[] = [
  {
    name: "Mukitu Islam Nishat",
    title: "Head Developer",
    bio: "Full Stack Software Developer. Responsible for architecture, UI systems and feature integration.",
    img: member1Img,
    portfolioUrl: "https://mukituislamnishat.vercel.app/",
    websiteUrl: "https://mukituislamnishat.vercel.app/",
    highlight: true,
  },
  {
    name: "Fahad Bin Aref",
    title: "Designer",
    bio: "Quality assurance testing and validation across core flows.",
    img: member2Img,
  },
  {
    name: "Rayhan Kobir Shah",
    title: "Idea",
    bio: "Project planning, coordination, and delivery management.",
    img: member3Img,
  },
  {
    name: "Md Raisul",
    title: "Data Manager",
    bio: "Data collection, organization, and integrity management.",
    img: member4Img,
  },
  {
    name: "Israt Jahan Aisha",
    title: "Documentation",
    bio: "Documentation, user-facing instructions, and content support.",
    img: member5Img,
  },
];

function MemberCard({ member }: { member: TeamMember }) {
  const isLead = !!member.highlight;

  return (
    <Card
      className={
        "group border-glass-border bg-glass shadow-soft backdrop-blur-xl transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-elevated" +
        (isLead ? " ring-1 ring-ring" : "")
      }
    >
      <div className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex shrink-0 justify-center sm:justify-start">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border border-glass-border bg-background/40">
              <img
                src={member.img}
                alt={`${member.name} photo`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="text-base font-semibold leading-tight">{member.name}</div>
              {isLead && (
                <span className="rounded-full border border-glass-border bg-background/40 px-2 py-0.5 text-xs">
                  Lead
                </span>
              )}
            </div>

            <div className="mt-1 text-sm text-muted-foreground">{member.title}</div>
            <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {member.portfolioUrl && (
                <Button asChild variant="hero" className="gap-2">
                  <a href={member.portfolioUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Portfolio
                  </a>
                </Button>
              )}
              {member.websiteUrl && (
                <Button asChild variant="glass" className="gap-2">
                  <a href={member.websiteUrl} target="_blank" rel="noreferrer">
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                </Button>
              )}

              <div className="ml-auto flex items-center gap-1">
                {member.githubUrl && (
                  <Button asChild variant="ghost" size="icon" aria-label={`${member.name} GitHub`}>
                    <a href={member.githubUrl} target="_blank" rel="noreferrer">
                      <Github />
                    </a>
                  </Button>
                )}
                {member.linkedinUrl && (
                  <Button asChild variant="ghost" size="icon" aria-label={`${member.name} LinkedIn`}>
                    <a href={member.linkedinUrl} target="_blank" rel="noreferrer">
                      <Linkedin />
                    </a>
                  </Button>
                )}
                {member.facebookUrl && (
                  <Button asChild variant="ghost" size="icon" aria-label={`${member.name} Facebook`}>
                    <a href={member.facebookUrl} target="_blank" rel="noreferrer">
                      <Facebook />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-4">
              <Button asChild variant="outline">
                <a href="/">Back to Dashboard</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function TeamPage() {
  const { t } = useI18n();
  const head = team.find((m) => m.highlight);
  const rest = team.filter((m) => !m.highlight);

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-6 animate-enter">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{t("team")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Team members with photos, titles, and portfolio/website links.
        </p>
      </header>

      {head && (
        <section className="mb-6">
          <MemberCard member={head} />
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        {rest.map((m) => (
          <MemberCard key={m.name} member={m} />
        ))}
      </section>

      <footer className="mt-10 border-t border-glass-border pt-6 pb-10">
        <div className="text-sm text-muted-foreground">{t("madeBy")}</div>
      </footer>
    </main>
  );
}
