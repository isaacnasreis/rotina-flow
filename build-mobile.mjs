import fs from 'fs';
import { execSync } from 'child_process';

const shareDir = './src/app/share';
const shareHidden = './src/app/_share';
const apiDir = './src/app/api';
const apiHidden = './src/app/_api';

try {
  console.log('\n🚀 Preparando Build Mobile (Ocultando rotas exclusivas do servidor Vercel)...');
  if (fs.existsSync(shareDir)) fs.renameSync(shareDir, shareHidden);
  if (fs.existsSync(apiDir)) fs.renameSync(apiDir, apiHidden);

  console.log('\n📦 Compilando Interface Mobile Estática (Next.js)...');
  // Pass env var safely for any OS without needing cross-env
  execSync('npx next build', { 
    stdio: 'inherit',
    env: { ...process.env, CAPACITOR_BUILD: 'true' }
  });

} catch (error) {
  console.error('\n❌ Build falhou!', error.message);
  process.exitCode = 1;
} finally {
  console.log('\n🧹 Restaurando código original...');
  if (fs.existsSync(shareHidden)) fs.renameSync(shareHidden, shareDir);
  if (fs.existsSync(apiHidden)) fs.renameSync(apiHidden, apiDir);
}

// Se o build deu erro, não sincronizamos
if (process.exitCode !== 1) {
  try {
    console.log('\n📲 Sincronizando arquivos com a pasta nativa do Android...');
    execSync('npx cap sync android', { stdio: 'inherit' });
    console.log('\n✅ Tudo pronto! Para empacotar o APK, abra o Android Studio com: npx cap open android\n');
  } catch(e) {
    console.error('\n❌ Falha ao sincronizar com o Capacitor', e.message);
  }
}
