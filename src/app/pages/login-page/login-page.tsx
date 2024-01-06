import { SingleCard } from "@/layouts";
import { LoginForm } from "@/components";
import { useI18n } from "@/i18n/useI18n";

export const LoginPage = () => {
  const { t } = useI18n("Common");
  return (
    <SingleCard title={t('login.signIn')}>
      <LoginForm />
    </SingleCard>
  );

};