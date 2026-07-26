export type AppMode = "citizen" | "admin" | "all";

export function getAppMode(): AppMode {
  const envMode = process.env.NEXT_PUBLIC_APP_MODE;
  if (envMode === "citizen") return "citizen";
  if (envMode === "admin") return "admin";
  return "all";
}

export const isCitizenApp = getAppMode() === "citizen";
export const isAdminApp = getAppMode() === "admin";

export function getDefaultHomeRoute(): string {
  const mode = getAppMode();
  if (mode === "admin") {
    return "/nagaradhyaksh";
  }
  return "/";
}
