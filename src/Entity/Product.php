<?php

/**
 * src/Entity/Product.php
 *
 * @license  https://opensource.org/licenses/MIT MIT License
 * @link     http://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(
 *     name="product",
 *     uniqueConstraints={
 *          @ORM\UniqueConstraint(
 *              name = "Product_name_uindex",
 *              columns = {"name"}
 *          )
 *      }
 * )
 */
class Product extends Element
{
    /**
     * @ORM\ManyToMany(
     *     targetEntity="Person",
     *     inversedBy="products"
     *     )
     * @ORM\JoinTable(
     *   name="person_contributes_product",
     *   joinColumns={
     *     @ORM\JoinColumn(
     *          name="product_id",
     *          referencedColumnName="id"
     *     )
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(
     *          name="person_id",
     *          referencedColumnName="id"
     *     )
     *   }
     * )
     */
    protected Collection $persons;

    /**
     * @ORM\ManyToMany(
     *     targetEntity="Entity",
     *     inversedBy="products"
     *     )
     * @ORM\JoinTable(
     *   name="entity_contributes_product",
     *   joinColumns={
     *     @ORM\JoinColumn(
     *          name="product_id",
     *          referencedColumnName="id"
     *     )
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(
     *          name="entity_id",
     *          referencedColumnName="id"
     *     )
     *   }
     * )
     */
    protected Collection $entities;

    /**
     * Entity constructor.
     * @param string $name
     * @param DateTime|null $birthDate
     * @param DateTime|null $deathDate
     * @param string|null $imageUrl
     * @param string|null $wikiUrl
     */
    public function __construct(
        string $name,
        ?DateTime $birthDate = null,
        ?DateTime $deathDate = null,
        ?string $imageUrl = null,
        ?string $wikiUrl = null
    ) {
        parent::__construct($name, $birthDate, $deathDate, $imageUrl, $wikiUrl);
        $this->persons = new ArrayCollection();
        $this->entities = new ArrayCollection();
    }

    // Entities

    /**
     * @return Entity[]
     */
    public function getEntities(): array
    {
        return $this->entities->getValues();
    }

    /**
     * @param Entity $entity
     * @return bool
     */
    public function containsEntity(Entity $entity): bool
    {
        return $this->entities->contains($entity);
    }

    /**
     * @param Entity $entity
     *
     * @return Product
     */
    public function addEntity(Entity $entity): self
    {
        if ($this->containsEntity($entity)) {
            return $this;
        }

        $this->entities->add($entity);
        return $this;
    }

    /**
     * @param Entity $entity
     *
     * @return Product|null Product if this collection contained the specified entity, null otherwise.
     */
    public function removeEntity(Entity $entity): ?self
    {
        if (!$this->containsEntity($entity)) {
            return null;
        }

        $this->entities->removeElement($entity);
        return $this;
    }

    // Persons

    /**
     * @return Person[]
     */
    public function getPersons(): array
    {
        return $this->persons->getValues();
    }

    /**
     * @param Person $person
     * @return bool
     */
    public function containsPerson(Person $person): bool
    {
        return $this->persons->contains($person);
    }

    /**
     * @param Person $person
     *
     * @return Product
     */
    public function addPerson(Person $person): self
    {
        if ($this->containsPerson($person)) {
            return $this;
        }

        $this->persons->add($person);
        return $this;
    }

    /**
     * @param Person $person
     *
     * @return Product|null Product if this collection contained the specified person, null otherwise.
     */
    public function removePerson(Person $person): ?self
    {
        if (!$this->containsPerson($person)) {
            return null;
        }

        $this->persons->removeElement($person);
        return $this;
    }

    /**
     * The __toString method allows a class to decide how it will react when it is converted to a string.
     *
     * @return string
     * @link http://php.net/manual/en/language.oop5.magic.php#language.oop5.magic.tostring
     */
    public function __toString(): string
    {
        return sprintf(
            '%s persons="%s", entities="%s")]',
            parent::__toString(),
            $this->getCodesTxt($this->getPersons()),
            $this->getCodesTxt($this->getEntities())
        );
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize(): array
    {
        $data = parent::jsonSerialize();
        $data['persons'] = $this->getPersons() ? $this->getCodes($this->getPersons()) : null;
        $data['entities'] = $this->getEntities() ? $this->getCodes($this->getEntities()) : null;

        return ['product' => $data];
    }
}
