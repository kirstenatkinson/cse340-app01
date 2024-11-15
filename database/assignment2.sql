-- Insert a new account into account table
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
) VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

DELETE
FROM public.account
WHERE account_email = 'tony@starkent.com';

UPDATE public.inventory
SET inv_description = REPLACE (inv_description, 'small interiors', 'huge interior')
WHERE inv_id = 10;

SELECT inv.inv_make AS make, inv.inv_model AS model
FROM public.inventory AS inv
INNER JOIN public.classification AS classification
	ON inv.classification_id = classification.classification_id
	WHERE inv.classification_id = 2;

UPDATE public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');