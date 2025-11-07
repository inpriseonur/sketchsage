import Image from 'next/image'

const examples = [
  {
    id: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDaJ9YEkySHeujYONrG4zQdRPU7X3q7sHFucbtcxS0PHKIhn_MRyEqo9bAx1v3GJ3teU47593uWRVZSBdwx4GhulQEkAZPzuyvZP5TLAeUgunpqFXaNeb-JJzheF3lz7uBAVNSrUIMYrv8O9tm9XRAjKmp60sGUBMYu1H3kmYFdQupTGkcTUvK6T0sCQXicfdVw10A8t47GEgwm5KmPSXL5LG5DHxD4ruOaAxFEo53QiaMBvKTlCoPUpBcAQGwZA4Q2qBL2RVNGu9Q',
    alt: 'Portrait sketch',
  },
  {
    id: 2,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCBKISuYXVtRHdLTgJAVTf-1RDS-SuqZxeoTZ-QUBK21JuOzoHcouNLuM2WTtOgXiaaHujO7U7-1JqG3a4xSMNHol5iJ9TEV32swgqcfozWsJPS2Ho2uZWEEbDpQQSYZozZTenCpVmq4bL6z3p2UkpLj7SHyevuB6VkggBYkEJkXJt-RkUoUpoprGeEGhZRujFQ-dlhD9G180PkKsYfJvcdRU-OLVF0435UiXYwU8VSor1-aTlZw3_OB4xUhrshcnT6hgM2dCxdvGQ',
    alt: 'Flower painting',
  },
  {
    id: 3,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCpqY-cudSOsOifibWYQhGKoNROhcGTqWXIj7FUwUl0kziM-f2BAz__C4-UQC8DLs502zl2zkUMtoZ8d0L5VytQA_kSBc0Gh6Fv-D-sSYAfBNjYgFuDV7DK5uo3KuzPhZsrFHMemBL9UCUZ_uoPbORxY-6kBSUQedmV5reG8KQ_dMSNBxzIqicId7QE4cIa0MTLv1p_pcOVGmM0CKngI-zaGQgMNpd1I-mgVMfQHilJzaNPYHUdBFsxDSKSHkH7lFF4UJHHGe5lqEY',
    alt: 'Architecture drawing',
  },
  {
    id: 4,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDqPPV0Dzn_zCTc_HOG_M8RnimY-q0ocoNIHhuoDAgbqrFwPNwB5To8H60lxGNCMiUlgFwpmUVcMSqLW7f8tFRus-WgNqCGohq7gNqmp_y8PeLUZKv13bpJGP7EPUKkn4ZJM-cbl9aRplfVNlGzrvwBPYQR--Y23TD_ldD8VsGDdAhCIqa3k0SoYEkh7xHnTe3b5YmxCAKl4-ZxMKjuxlDjwhUIE63604uL3Qbesc8rC5dccY6pdn61kWtXoVthOn2SByWeinisA-g',
    alt: 'Landscape painting',
  },
]

export default function QualitySection() {
  return (
    <section>
        <h2 className="text-white text-[22px] font-bold tracking-[-0.015em] px-4 pb-3 pt-5 border-b-2 border-[#d41111]/30">
          See the Quality of Feedback
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 p-4 pt-8">
          {examples.map((e) => (
            <div key={e.id} className="flex flex-col gap-3">
              <div
                className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg"
                style={{ backgroundImage: `url(${e.image})` }}
                aria-label={e.alt}
              />
            </div>
          ))}
        </div>
    </section>
  )
}

