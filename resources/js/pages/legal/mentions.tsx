import { Head } from '@inertiajs/react';
import { LegalLayout, LegalSection, LegalP, LegalList } from './layout';

export default function MentionsLegales() {
    return (
        <>
            <Head title="Mentions légales — Fondation TITI" />
            <LegalLayout title="Mentions légales" lastUpdated="19 mai 2026">
                <LegalSection title="Éditeur du site">
                    <LegalP>Le site <strong>fondation-titi.org</strong> est édité par :</LegalP>
                    <LegalList items={[
                        'Dénomination : Fondation TITI',
                        'Statut juridique : Fondation à but non lucratif',
                        'Siège social : Yaoundé, Cameroun',
                        'Email : info@fondation-titi.org',
                        'Téléphone : +237 000 000 000',
                    ]} />
                </LegalSection>

                <LegalSection title="Directeur de la publication">
                    <LegalP>Le directeur de la publication est le Président de la Fondation TITI.</LegalP>
                </LegalSection>

                <LegalSection title="Hébergement">
                    <LegalP>Le site est hébergé par un prestataire technique sécurisé. Les données sont stockées sur des serveurs situés en Europe, conformément à la réglementation applicable.</LegalP>
                </LegalSection>

                <LegalSection title="Propriété intellectuelle">
                    <LegalP>
                        L'ensemble des contenus présents sur ce site (textes, images, logos, vidéos, etc.) sont la propriété exclusive de la Fondation TITI ou de ses partenaires, et sont protégés par le droit camerounais et international de la propriété intellectuelle.
                    </LegalP>
                    <LegalP>
                        Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est strictement interdite.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Limitation de responsabilité">
                    <LegalP>
                        La Fondation TITI s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Cependant, elle ne peut garantir l'exactitude, la complétude ou la pertinence des informations mises à disposition.
                    </LegalP>
                    <LegalP>
                        La Fondation TITI ne saurait être tenue responsable des dommages directs ou indirects causés au matériel de l'utilisateur lors de l'accès au site.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Liens hypertextes">
                    <LegalP>
                        Le site peut contenir des liens vers des sites tiers. La Fondation TITI n'est pas responsable du contenu de ces sites externes et ne peut être tenue responsable des dommages ou préjudices pouvant résulter de leur consultation.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Droit applicable">
                    <LegalP>
                        Le présent site est soumis au droit camerounais. Tout litige relatif à l'utilisation du site sera soumis à la compétence des tribunaux de Yaoundé, Cameroun.
                    </LegalP>
                </LegalSection>
            </LegalLayout>
        </>
    );
}
