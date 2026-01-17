import { useI18n } from "@/lib/i18n";

export default function BloodBankServicePage() {
  const { lang } = useI18n();
  const bn = lang === "bn";

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-6 animate-enter">
      <header className="mb-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{bn ? "ব্লাড ব্যাংক" : "Blood Bank"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {bn
                ? "গুগল/ফেসবুক থেকে ভেরিফাইড তথ্য খুঁজে নিন—সতর্ক থাকুন প্রতারক থেকে।"
                : "Use Google/Facebook to find verified sources—stay safe from scammers."}
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="rounded-2xl border border-glass-border bg-glass p-6 text-sm">
          <h2 className="text-base font-semibold tracking-tight">{bn ? "কিভাবে খুঁজবেন" : "How to search"}</h2>

          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-medium text-muted-foreground">{bn ? "Google সার্চ" : "Google search"}</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>{bn ? "এইভাবে লিখুন: “জেলা নাম + blood bank”, “জেলা নাম + Sandhani”, “জেলা নাম + Red Crescent”" : "Try: “district name + blood bank”, “district name + Sandhani”, “district name + Red Crescent”."}</li>
                <li>{bn ? "ফলাফলে Official website/verified page (blue tick) অগ্রাধিকার দিন।" : "Prefer official websites / verified pages (blue tick)."}</li>
                <li>{bn ? "ফোন নম্বর/ঠিকানা ২টা আলাদা সোর্সে মিলিয়ে নিন।" : "Cross-check phone/address from at least 2 sources."}</li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-medium text-muted-foreground">{bn ? "Facebook সার্চ" : "Facebook search"}</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>{bn ? "Search: “জেলা নাম Blood Donor”, “জেলা নাম + রক্তদান”, “জেলা নাম + blood group AB+ donor”" : "Search: “district name Blood Donor”, “district name + donate blood”, “district name + blood group AB+ donor”."}</li>
                <li>{bn ? "Group/Post দেখলে Admin/Moderator কে verify করতে বলুন।" : "If using groups/posts, ask admins/mods to verify."}</li>
                <li>{bn ? "পুরনো/ফেইক পোস্ট (copy-paste, vague address) এড়িয়ে চলুন।" : "Avoid copy‑paste or vague-address posts."}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-glass-border bg-glass p-6 text-sm">
          <h2 className="text-base font-semibold tracking-tight">{bn ? "রক্ত দেওয়া/নেওয়ার নিয়ম" : "Rules for donating/receiving blood"}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>{bn ? "রোগীর রক্তের গ্রুপ ও ক্রস-ম্যাচ রিপোর্ট ছাড়া রক্ত নেবেন না।" : "Do not accept blood without blood group and cross-match reports."}</li>
            <li>{bn ? "ডোনারকে সম্ভব হলে হাসপাতাল/ক্লিনিকেই ব্লাড দিতে বলুন।" : "Prefer donating at a hospital/clinic."}</li>
            <li>{bn ? "ডোনারের বয়স/ওজন/স্বাস্থ্য অবস্থা যাচাই করুন (ডাক্তার/নার্স সহায়তা নিন)।" : "Verify donor eligibility (age/weight/health) with medical staff."}</li>
            <li>{bn ? "রক্ত নেওয়ার আগে ব্যাগের সিল, মেয়াদ, লেবেল (গ্রুপ/তারিখ) চেক করুন।" : "Check seal, expiry, and label (group/date) before receiving."}</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-glass-border bg-glass p-6 text-sm">
          <h2 className="text-base font-semibold tracking-tight">{bn ? "প্রতারক/স্ক্যামার থেকে বাঁচবেন" : "Avoid scams"}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>{bn ? "আগে টাকা চাইলে (বিকাশ/নগদ) সতর্ক হোন—বিশেষ করে “রক্ত আনতে গাড়ি ভাড়া” অজুহাতে।" : "Be cautious if they ask for money upfront (bKash/Nagad), especially for “transport fees”."}</li>
            <li>{bn ? "জাতীয় পরিচয়পত্র/আইডি, হাসপাতালের নাম, ও লোকেশন—সব মিলিয়ে যাচাই করুন।" : "Verify ID, hospital name, and location together."}</li>
            <li>{bn ? "একই নম্বর/নাম বারবার বিভিন্ন পোস্টে থাকলে সন্দেহ করুন।" : "Suspicious if the same number/name appears across many posts."}</li>
            <li>{bn ? "সম্ভব হলে পরিচিত/রেফারেন্সড ডোনার/অর্গানাইজেশন ব্যবহার করুন।" : "Prefer known/referenced donors/organizations."}</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            {bn
              ? "নোট: এখানে কোনো ব্লাড ব্যাংক লিস্ট দেখানো হচ্ছে না—আপনি চাইলে আপনার নিজস্ব লোকাল ডাটা পরে যোগ করে দিতে পারেন।"
              : "Note: This page doesn’t show a blood bank list yet—you can add your own local dataset later."}
          </p>
        </div>
      </section>
    </main>
  );
}
