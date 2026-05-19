import { Head } from '@inertiajs/react';
import { LegalLayout, LegalSection, LegalP, LegalList } from './layout';

export default function CGU() {
    return (
        <>
            <Head title="Conditions d'utilisation — TITI EVENTS" />
            <LegalLayout title="Conditions générales d'utilisation" lastUpdated="19 mai 2026">
                <LegalSection title="Objet">
                    <LegalP>
                        Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme en ligne de la TITI EVENTS, accessible à l'adresse fondation-titi.org.
                    </LegalP>
                    <LegalP>
                        En accédant à la plateforme, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Inscription et compte utilisateur">
                    <LegalP>Pour accéder à certaines fonctionnalités, l'inscription est obligatoire. L'utilisateur s'engage à :</LegalP>
                    <LegalList items={[
                        'Fournir des informations exactes, complètes et à jour lors de l\'inscription',
                        'Maintenir la confidentialité de ses identifiants de connexion',
                        'Notifier immédiatement la TITI EVENTS de toute utilisation non autorisée de son compte',
                        'Ne pas créer de faux comptes ou usurper l\'identité d\'une autre personne',
                    ]} />
                </LegalSection>

                <LegalSection title="Utilisation de la plateforme">
                    <LegalP>L'utilisateur s'engage à utiliser la plateforme de manière conforme à sa destination et aux lois en vigueur. Il est notamment interdit de :</LegalP>
                    <LegalList items={[
                        'Publier des contenus illicites, diffamatoires, obscènes ou portant atteinte aux droits de tiers',
                        'Tenter d\'accéder de manière non autorisée aux systèmes informatiques',
                        'Utiliser la plateforme à des fins commerciales non autorisées',
                        'Perturber le fonctionnement de la plateforme par tout moyen',
                        'Collecter des données personnelles d\'autres utilisateurs sans leur consentement',
                    ]} />
                </LegalSection>

                <LegalSection title="Participation aux événements et concours">
                    <LegalP>
                        La participation aux événements et concours organisés par la TITI EVENTS est soumise à des conditions particulières communiquées lors de chaque événement. La TITI EVENTS se réserve le droit d'exclure tout participant ne respectant pas ces conditions.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Dons et contributions">
                    <LegalP>
                        Les dons effectués via la plateforme sont définitifs et non remboursables, sauf en cas d'erreur technique dûment constatée. La TITI EVENTS s'engage à utiliser les fonds reçus conformément à sa mission sociale et à ses engagements déclarés.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Suspension et résiliation">
                    <LegalP>
                        La TITI EVENTS se réserve le droit de suspendre ou de supprimer tout compte utilisateur en cas de violation des présentes CGU, sans préavis ni indemnité. L'utilisateur peut également supprimer son compte à tout moment depuis les paramètres de son profil.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Modification des CGU">
                    <LegalP>
                        La TITI EVENTS se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur la plateforme. L'utilisation continue de la plateforme après modification vaut acceptation des nouvelles CGU.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Contact">
                    <LegalP>
                        Pour toute question relative aux présentes CGU, contactez-nous à : <strong>legal@fondation-titi.org</strong>
                    </LegalP>
                </LegalSection>
            </LegalLayout>
        </>
    );
}
