import express from 'express';
import { categoriesService } from '@/services/categories';
import { ListCategoriesQueryParameters } from '@/typebox/categories';
import { validate } from '@/utils/validator';
// import validators from '@/controllers/utils/validators';

export const categoriesRouter = express.Router();

/******************************************************************************
 * Create category
 *****************************************************************************/

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Create category
 *     description: Creates a new category
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInsert'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

categoriesRouter.post('/', async (req, res, next) => {
  const result = await categoriesService.create(req.body);
  if (!result.success) {
    return next(result.error);
  }
  res.json(result.payload);
});

/******************************************************************************
 * List categories
 *****************************************************************************/

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: List categories
 *     description: Retrieves a paginated list of categories, optionally filtered by parent category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Pagination cursor
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items to return
 *       - in: query
 *         name: childrenOf
 *         schema:
 *           type: string
 *           format: base64url
 *         description: Filter categories that are descendants of the specified category ID
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
categoriesRouter.get('/', async (req, res, next) => {
  const validatedQueryParams = validate(ListCategoriesQueryParameters, req.query, 'Invalid query parameters');
  if (!validatedQueryParams.success) {
    return next(validatedQueryParams.error);
  }

  const result = await categoriesService.list(validatedQueryParams.data);
  if (!result.success) {
    return next(result.error);
  }

  res.json(result.payload);
});