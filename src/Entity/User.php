<?php

/**
 * src/Entity/User.php
 *
 * @license  https://opensource.org/licenses/MIT MIT License
 * @link     http://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Entity;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;
use UnexpectedValueException;

/**
 * @ORM\Entity()
 * @ORM\Table(
 *     name                 = "user",
 *     uniqueConstraints    = {
 *          @ORM\UniqueConstraint(
 *              name="IDX_UNIQ_USERNAME", columns={ "username" }
 *          ),
 *          @ORM\UniqueConstraint(
 *              name="IDX_UNIQ_EMAIL", columns={ "email" }
 *          )
 *      }
 *     )
 */
class User implements JsonSerializable
{
    /**
     * @ORM\Column(
     *     name     = "id",
     *     type     = "integer",
     *     nullable = false
     *     )
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected int $id;

    /**
     * @ORM\Column(
     *     name     = "username",
     *     type     = "string",
     *     length   = 32,
     *     unique   = true,
     *     nullable = false
     *     )
     */
    protected string $username;

    /**
     * @ORM\Column(
     *     name     = "email",
     *     type     = "string",
     *     length   = 60,
     *     unique   = true,
     *     nullable = false
     *     )
     */
    protected string $email;

    /**
     * @ORM\Column(
     *     name     = "password",
     *     type     = "string",
     *     length   = 60,
     *     nullable = false
     *     )
     */
    protected string $password_hash;

    /**
     * @ORM\Embedded(
     *     class="TDW\ACiencia\Entity\Role"
     * )
     */
    protected Role $role;

    /**
     * @ORM\Column(
     *     name     = "fechanac",
     *     type     = "string",
     *     length   = 30,
     *     unique   = false,
     *     nullable = true
     *     )
     */
    protected string $fechanac;

    /**
     * @ORM\Column(
     *     name     = "activo",
     *     type     = "string",
     *     length   = 30,
     *     unique   = false,
     *     nullable = true
     *     )
     */
    protected string $activo;

    /**
     * User constructor.
     *
     * @param string $username username
     * @param string $email email
     * @param string $password password
     * @param string $role Role::ROLE_READER | Role::ROLE_WRITER
     * @param string $fechanac fechanac
     * @param string $activo activo
     *
     * @throws UnexpectedValueException
     */
    public function __construct(
        string $username = '',
        string $email = '',
        string $password = '',
        string $fechanac = '',
        string $activo = '',
        string $role = Role::ROLE_READER
    ) {
        $this->id       = 0;
        $this->username = $username;
        $this->email    = $email;
        $this->fechanac = $fechanac;
        $this->activo = $activo;
        $this->setPassword($password);
        try {
            $this->setRole($role);
        } catch (UnexpectedValueException) {
            throw new UnexpectedValueException('Unexpected Role');
        }
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * Set username
     *
     * @param string $username username
     * @return User
     */
    public function setUsername(string $username): self
    {
        $this->username = $username;
        return $this;
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param string $email email
     * @return User
     */
    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    /**
     * @param string $role
     * @return boolean
     */
    public function hasRole(string $role): bool
    {
        return $this->role->hasRole($role);
    }
    /**
     * Get fechanac
     *
     * @return string
     */
    public function getFechaNac(): string
    {
        return $this->fechanac;
    }

    /**
     * Set fechanac
     *
     * @param string $fechanac fechanac
     * @return User
     */
    public function setFechaNac(string $fechanac): self
    {
        $this->fechanac = $fechanac;
        return $this;
    }

    /**
     * Get activo
     *
     * @return string
     */
    public function getActivo(): string
    {
        return $this->activo;
    }

    /**
     * Set activo
     *
     * @param string $activo activo
     * @return User
     */
    public function setActivo(string $activo): self
    {
        $this->activo = $activo;
        return $this;
    }

    /**
     * @param string $role [ Role::ROLE_READER | Role::ROLE_WRITER ]
     * @throws UnexpectedValueException
     * @return User
     */
    public function setRole(string $role): self
    {
        // Object types are compared by reference, not by value.
        // Doctrine updates this values if the reference changes and therefore
        // behaves as if these objects are immutable value objects.
        $this->role = new Role($role);
        return $this;
    }

    /**
     * @return array ['reader'] | ['reader', 'writer']
     */
    public function getRoles(): array
    {
        $roles = array_filter(
            Role::ROLES,
            fn($myRole) => $this->hasRole($myRole)
        );

        return $roles;
    }

    /**
     * Get the hashed password
     *
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password_hash;
    }

    /**
     * @param string $password password
     * @return User
     */
    public function setPassword(string $password): self
    {
        $this->password_hash = strval(password_hash($password, PASSWORD_DEFAULT));
        return $this;
    }

    /**
     * Verifies that the given hash matches the user password.
     *
     * @param string $password password
     * @return boolean
     */
    public function validatePassword(string $password): bool
    {
        return password_verify($password, $this->password_hash);
    }

    /**
     * The __toString method allows a class to decide how it will react when it is converted to a string.
     *
     * @return string
     * @link http://php.net/manual/en/language.oop5.magic.php#language.oop5.magic.tostring
     */
    public function __toString(): string
    {
        return
            sprintf(
                '[%s: (id=%04d, username="%s", email="%s", role="%s")]',
                basename(self::class),
                $this->getId(),
                $this->getUsername(),
                $this->getEmail(),
                $this->role
            );
    }

    /**
     * Specify data which should be serialized to JSON
     * @link http://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return array data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    public function jsonSerialize(): array
    {
        return [
            'user' => [
                'id' => $this->getId(),
                'username' => $this->getUsername(),
                'email' => $this->getEmail(),
                'role' => $this->role->__toString(),
                'fechanac' => $this->getFechaNac(),
                'activo' => $this->getActivo()
            ]
        ];
    }
}
