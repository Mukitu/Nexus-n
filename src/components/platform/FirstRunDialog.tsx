import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useI18n } from "@/lib/i18n";

export function FirstRunDialog() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("aodup_tutorial_seen");
    if (!seen) setOpen(true);
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-glass border-glass-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">{t("tutorialTitle")}</AlertDialogTitle>
          <AlertDialogDescription>{t("tutorialBody")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              localStorage.setItem("aodup_tutorial_seen", "1");
              setOpen(false);
            }}
          >
            {t("tutorialCta")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
