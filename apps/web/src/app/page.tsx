import { Button } from "@repo/ui";

export default function HomePage() {
  return (
    <main className="shell">
      <section className="intro" aria-labelledby="home-title">
        <p className="eyebrow">DentSaaS Web</p>
        <h1 id="home-title">Panel listo para construir la experiencia dental.</h1>
        <p className="lead">
          Next.js ya esta inicializado dentro del monorepo. Desde aqui podemos
          conectar autenticacion, agenda, pacientes y el API existente.
        </p>
        <div className="mt-6 flex gap-3">
          <Button>Comenzar</Button>
          <Button variant="outline">Ver documentación</Button>
        </div>
      </section>
    </main>
  );
}
