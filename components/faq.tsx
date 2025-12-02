import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const items = [
    {
      q: "Is there a fee to join?",
      a: "No. Volunteers can join for free. NGOs have a free tier and optional premium tools.",
    },
    {
      q: "How are NGOs verified?",
      a: "We run verification checks and require documentation for NGO onboarding.",
    },
    {
      q: "Can I volunteer remotely?",
      a: "Yes. Many roles support remote collaboration and flexible schedules.",
    },
  ]

  return (
    <section className="section-container">
      <div className="mb-8">
        <h2 className="gradient-text text-balance text-2xl font-semibold md:text-3xl">Frequently asked questions</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {items.map((it, idx) => (
          <AccordionItem key={idx} value={`item-${idx}`}>
            <AccordionTrigger>{it.q}</AccordionTrigger>
            <AccordionContent>{it.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
