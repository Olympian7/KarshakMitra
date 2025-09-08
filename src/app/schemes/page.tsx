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
import { Badge } from '@/components/ui/badge';

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
                    <p className="text-muted-foreground">{scheme.description}</p>
                    
                     <div className="p-4 border rounded-lg bg-muted/20">
                      <h4 className="font-semibold mb-2">Key Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {scheme.keyBenefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary">{benefit}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold">Eligibility</h4>
                      <p className="text-muted-foreground">{scheme.eligibility}</p>
                    </div>
                     <div>
                      <h4 className="font-semibold">Benefits</h4>
                      <p className="text-muted-foreground">{scheme.benefits}</p>
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
