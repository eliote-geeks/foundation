<?php

namespace Database\Factories;

use App\Models\Partner;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Partner>
 */
class PartnerFactory extends Factory
{
    protected $model = Partner::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Technologie', 'Finance', 'Éducation', 'Télécommunications', 'Énergie', 'Agroalimentaire', 'Transport'];
        $partnershipTypes = ['Financier', 'Technique', 'Académique', 'Environnemental', 'Social', 'Innovation'];
        $statuses = ['active', 'pending', 'suspended', 'inactive'];
        $budgetRanges = ['< 1M FCFA', '1-5M FCFA', '5-10M FCFA', '10-50M FCFA', '> 50M FCFA'];

        $category = $this->faker->randomElement($categories);
        $partnershipType = $this->faker->randomElement($partnershipTypes);
        
        $startDate = $this->faker->dateTimeBetween('-3 years', '-1 month');
        $endDate = $this->faker->optional(0.7)->dateTimeBetween($startDate, '+2 years');

        return [
            'name' => $this->faker->company(),
            'description' => $this->faker->paragraph(3),
            'website' => $this->faker->optional(0.8)->url(),
            'email' => $this->faker->companyEmail(),
            'phone' => $this->faker->optional(0.9)->phoneNumber(),
            'contact_person' => $this->faker->name(),
            'contact_position' => $this->faker->randomElement([
                'Directeur Général', 'Directeur RSE', 'Responsable Partenariats', 
                'Chef de Projet', 'Directeur Développement', 'Responsable Communication'
            ]),
            'category' => $category,
            'partnership_type' => $partnershipType,
            'status' => $this->faker->randomElement($statuses),
            'contribution_amount' => $this->faker->optional(0.7)->randomFloat(2, 500000, 50000000),
            'contribution_currency' => 'FCFA',
            'partnership_start_date' => $startDate,
            'partnership_end_date' => $endDate,
            'partnership_details' => $this->faker->optional(0.6)->paragraph(2),
            'budget_range' => $this->faker->randomElement($budgetRanges),
            'sectors_of_interest' => $this->faker->optional(0.5)->randomElements([
                'Education', 'Santé', 'Environnement', 'Technologie', 'Agriculture', 
                'Jeunesse', 'Femmes', 'Innovation', 'Développement rural'
            ], $this->faker->numberBetween(1, 3)),
            'is_featured' => $this->faker->boolean(20), // 20% chance d'être featured
            'priority' => $this->faker->numberBetween(0, 100),
            'internal_notes' => $this->faker->optional(0.4)->paragraph(1),
            'last_contact_date' => $this->faker->optional(0.8)->dateTimeBetween('-6 months', 'now'),
            'contract_reference' => $this->faker->optional(0.9)->regexify('[A-Z]{2,3}-[0-9]{4}-[0-9]{3}'),
        ];
    }

    /**
     * État pour un partenaire actif
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'partnership_start_date' => $this->faker->dateTimeBetween('-2 years', '-1 month'),
            'last_contact_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    /**
     * État pour un partenaire en attente
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'partnership_start_date' => null,
            'partnership_end_date' => null,
            'contribution_amount' => null,
        ]);
    }

    /**
     * État pour un partenaire mis en avant
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'priority' => $this->faker->numberBetween(80, 100),
            'status' => 'active',
        ]);
    }

    /**
     * État pour un partenaire technologique
     */
    public function technology(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Technologie',
            'partnership_type' => $this->faker->randomElement(['Technique', 'Innovation']),
            'sectors_of_interest' => ['Technologie', 'Innovation', 'Digital'],
        ]);
    }

    /**
     * État pour un partenaire financier
     */
    public function financial(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Finance',
            'partnership_type' => 'Financier',
            'contribution_amount' => $this->faker->randomFloat(2, 5000000, 50000000),
            'budget_range' => $this->faker->randomElement(['10-50M FCFA', '> 50M FCFA']),
        ]);
    }
}