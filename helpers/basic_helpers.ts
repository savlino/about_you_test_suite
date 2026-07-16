import { Locator } from "@playwright/test";

export async function getElementTextAsNumber(locator: Locator): Promise<number> {
    const text = await locator.innerText();
    return Number(text.replace(/\D/g, ''));
}
