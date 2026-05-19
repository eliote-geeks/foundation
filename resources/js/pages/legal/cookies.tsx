import { Head } from '@inertiajs/react';
import { LegalLayout, LegalSection, LegalP, LegalList } from './layout';

export default function Cookies() {
    return (
        <>
            <Head title="Politique de cookies — TITI EVENTS" />
            <LegalLayout title="Politique de cookies" lastUpdated="19 mai 2026">
                <LegalSection title="Qu'est-ce qu'un cookie ?">
                    <LegalP>
                        Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site web. Il permet au site de mémoriser des informations sur votre visite pour vous offrir une meilleure expérience.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Cookies que nous utilisons">
                    <LegalP><strong>Cookies strictement nécessaires</strong></LegalP>
                    <LegalList items={[
                        'Cookie de session : maintient votre connexion pendant votre visite',
                        'Cookie CSRF : protège vos formulaires contre les attaques malveillantes',
                        'Cookie de préférence de langue : mémorise votre langue choisie',
                    ]} />

                    <LegalP><strong>Cookies de performance (avec votre consentement)</strong></LegalP>
                    <LegalList items={[
                        'Mesure d\'audience : comptage des visites et pages vues',
                        'Analyse des erreurs : amélioration de la stabilité de la plateforme',
                    ]} />

                    <LegalP><strong>Cookies de préférence</strong></LegalP>
                    <LegalList items={[
                        'Thème d\'affichage : mémorise votre choix clair/sombre/système',
                        'Préférences de notification : vos choix de communication',
                    ]} />
                </LegalSection>

                <LegalSection title="Cookies tiers">
                    <LegalP>
                        Nous n'utilisons pas de cookies publicitaires ou de tracking tiers. Aucune donnée n'est partagée avec des réseaux publicitaires.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Durée de conservation">
                    <LegalList items={[
                        'Cookies de session : supprimés à la fermeture du navigateur',
                        'Cookie de préférence de langue : 1 an',
                        'Cookie de thème : 1 an',
                        'Cookies analytiques : 13 mois maximum',
                    ]} />
                </LegalSection>

                <LegalSection title="Gérer vos cookies">
                    <LegalP>
                        Vous pouvez contrôler et supprimer les cookies via les paramètres de votre navigateur. Notez que la désactivation des cookies strictement nécessaires peut affecter le fonctionnement de la plateforme.
                    </LegalP>
                    <LegalP>
                        Pour en savoir plus sur la gestion des cookies selon votre navigateur : consultez l'aide de Chrome, Firefox, Safari, Edge ou Opera.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Contact">
                    <LegalP>
                        Pour toute question sur notre utilisation des cookies : <strong>privacy@fondation-titi.org</strong>
                    </LegalP>
                </LegalSection>
            </LegalLayout>
        </>
    );
}
