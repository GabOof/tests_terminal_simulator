import { test, expect } from '@playwright/test';

// O navegador é reiniciado antes de cada teste.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

async function executar(page, comando) {
  await page.locator('#inputComando').fill(comando);
  await page.locator('#inputComando').press('Enter');
}

test('TCP-01: criar diretório pela interface', async ({ page }) => {
  await executar(page, 'mkdir documentos');
  await expect(page.locator('#output')).toContainText('Diretório criado.');
  await expect(page.locator('#arvoreArquivos')).toContainText('documentos');
  await page.screenshot({ path: 'docs/evidencias/TCP-01.png', fullPage: true });
});

test('TCP-02: criar arquivo pela interface', async ({ page }) => {
  await executar(page, 'touch notas.txt');
  await expect(page.locator('#output')).toContainText('Arquivo criado.');
  await expect(page.locator('#arvoreArquivos')).toContainText('notas.txt');
  await page.screenshot({ path: 'docs/evidencias/TCP-02.png', fullPage: true });
});

test('TCP-03: tentar navegar para pasta inexistente', async ({ page }) => {
  await executar(page, 'cd inexistente');
  await expect(page.locator('#output')).toContainText('Diretório inexistente.');
  await page.screenshot({ path: 'docs/evidencias/TCP-03.png', fullPage: true });
});

test('TCP-04: limpar a saída visual', async ({ page }) => {
  await executar(page, 'mkdir temporario');
  await expect(page.locator('#output')).toContainText('Diretório criado.');
  await executar(page, 'clear');
  await expect(page.locator('#output')).not.toContainText('Diretório criado.');
  await expect(page.locator('#output')).not.toContainText('Bem-vindo');
  await page.screenshot({ path: 'docs/evidencias/TCP-04.png', fullPage: true });
});
