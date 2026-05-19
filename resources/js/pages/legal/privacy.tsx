import { Head } from '@inertiajs/react';
import { LegalLayout, LegalSection, LegalP, LegalList } from './layout';

export default function Privacy() {
    return (
        <>
            <Head title="Politique de confidentialité — TITI EVENTS" />
            <LegalLayout title="Politique de confidentialité" lastUpdated="19 mai 2026">
                <LegalSection title="Introduction">
                    <LegalP>
                        La TITI EVENTS attache une grande importance à la protection de vos données personnelles. La présente politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre plateforme.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Données collectées">
                    <LegalP>Nous collectons les catégories de données suivantes :</LegalP>
                    <LegalList items={[
                        'Données d\'identité : nom, prénom, adresse email',
                        'Données de contact : numéro de téléphone, ville, pays',
                        'Données de profil : type d\'adhésion, compétences, centres d\'intérêt',
                        'Données de transaction : historique des dons et paiements',
                        'Données de navigation : adresse IP, type de navigateur, pages visitées',
                    ]} />
                </LegalSection>

                <LegalSection title="Finalités du traitement">
                    <LegalP>Vos données sont utilisées pour :</LegalP>
                    <LegalList items={[
                        'Gérer votre compte et vous identifier sur la plateforme',
                        'Traiter vos inscriptions aux événements et concours',
                        'Gérer vos dons et vous envoyer les reçus fiscaux',
                        'Vous envoyer des communications relatives à nos activités (avec votre consentement)',
                        'Améliorer notre plateforme et nos services',
                        'Respecter nos obligations légales et réglementaires',
                    ]} />
                </LegalSection>

                <LegalSection title="Base légale du traitement">
                    <LegalP>Nous traitons vos données sur les bases légales suivantes :</LegalP>
                    <LegalList items={[
                        'Exécution du contrat : pour vous fournir nos services',
                        'Intérêt légitime : pour améliorer nos services et prévenir la fraude',
                        'Consentement : pour les communications marketing',
                        'Obligation légale : pour la gestion comptable et fiscale',
                    ]} />
                </LegalSection>

                <LegalSection title="Partage des données">
                    <LegalP>
                        Vos données personnelles ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement avec :
                    </LegalP>
                    <LegalList items={[
                        'Nos prestataires techniques (hébergement, paiement) soumis à des obligations de confidentialité',
                        'Les autorités compétentes si requis par la loi',
                        'Nos partenaires institutionnels avec votre consentement explicite',
                    ]} />
                </LegalSection>

                <LegalSection title="Conservation des données">
                    <LegalP>
                        Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, et en tout état de cause :
                    </LegalP>
                    <LegalList items={[
                        'Données de compte : jusqu\'à la suppression de votre compte + 1 an',
                        'Données de transaction : 10 ans (obligation comptable)',
                        'Données de navigation : 13 mois maximum',
                    ]} />
                </LegalSection>

                <LegalSection title="Vos droits">
                    <LegalP>Conformément à la réglementation applicable, vous disposez des droits suivants :</LegalP>
                    <LegalList items={[
                        'Droit d\'accès à vos données personnelles',
                        'Droit de rectification des données inexactes',
                        'Droit à l\'effacement (« droit à l\'oubli »)',
                        'Droit à la limitation du traitement',
                        'Droit à la portabilité de vos données',
                        'Droit d\'opposition au traitement',
                        'Droit de retirer votre consentement à tout moment',
                    ]} />
                    <LegalP>
                        Pour exercer ces droits, contactez-nous à : <strong>privacy@fondation-titi.org</strong>
                    </LegalP>
                </LegalSection>

                <LegalSection title="Sécurité">
                    <LegalP>
                        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction. Les transmissions de données sont chiffrées via le protocole HTTPS.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Contact">
                    <LegalP>
                        Pour toute question relative à cette politique ou pour exercer vos droits : <strong>privacy@fondation-titi.org</strong>
                    </LegalP>
                </LegalSection>
            </LegalLayout>
        </>
    );
}
