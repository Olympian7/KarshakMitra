import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getGovSchemes } from '@/services/govSchemes';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import AppShell from '@/components/app-shell';

export default async function SchemesPage() {
  const schemes = await getGovSchemes();

  return (
    <AppShell title="Government Schemes" activePage="schemes">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Accordion type="single" collapsible className="w-full">
            {schemes.map((scheme) => (
              <AccordionItem value={`item-${scheme.id}`} key={scheme.id}>
                <AccordionTrigger>{scheme.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>{scheme.description}</p>
                    <div>
                      <h4 className="font-semibold">Eligibility</h4>
                      <p>{scheme.eligibility}</p>
                    </div>
                     <div>
                      <h4 className="font-semibold">Benefits</h4>
                      <p>{scheme.benefits}</p>
                    </div>
                    <Button asChild>
                      <Link href={scheme.link} target="_blank" rel="noopener noreferrer">
                        Learn More & Apply
                      </Link>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </main>
    </AppShell>
  );
}
