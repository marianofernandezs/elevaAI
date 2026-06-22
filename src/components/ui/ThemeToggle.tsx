import { Laptop, Moon, SunMedium } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemeToggleProps {
  showText?: boolean;
}

export default function ThemeToggle({ showText = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const nextLabel =
    theme === "light" ? "Activar modo oscuro" : theme === "dark" ? "Usar tema del sistema" : "Activar modo claro";
  const buttonTitle = theme === "light" ? "Modo oscuro" : theme === "dark" ? "Tema del sistema" : "Modo claro";
  const buttonText = theme === "light" ? "Oscuro" : theme === "dark" ? "Sistema" : "Claro";

  return (
    <button
      type="button"
      className={`theme-toggle ${showText ? "" : "h-10 w-10 !p-0 justify-center shrink-0"}`}
      onClick={toggleTheme}
      aria-label={nextLabel}
      title={buttonTitle}
    >
      <span className="theme-toggle__icon">
        {theme === "light" ? <Moon className="h-4 w-4" /> : theme === "dark" ? <Laptop className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
      </span>
      {showText && <span className="hidden sm:inline">{buttonText}</span>}
    </button>
  );
}
