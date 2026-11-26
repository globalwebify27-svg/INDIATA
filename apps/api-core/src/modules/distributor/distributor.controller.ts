import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { DistributorService } from "./distributor.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  UserRole,
  AuthenticatedUser,
  QueryTransactionsDto,
  QueryTransactionsDtoSchema,
  RecordTransactionDto,
  RecordTransactionDtoSchema,
  QueryPayoutsDto,
  QueryPayoutsDtoSchema,
  RequestPayoutDto,
  RequestPayoutDtoSchema,
  QueryCandidatesDto,
  QueryCandidatesDtoSchema,
  OnboardCandidateDto,
  OnboardCandidateDtoSchema,
  QueryEnquiriesDto,
  QueryEnquiriesDtoSchema,
  CreateEnquiryDto,
  CreateEnquiryDtoSchema,
  UpdateBankDetailsDto,
  UpdateBankDetailsDtoSchema,
} from "@rajtantra/common-types";

@Controller("distributor")
@Roles(UserRole.SUPER_ADMIN, UserRole.DISTRIBUTOR)
export class DistributorController {
  constructor(private readonly distributorService: DistributorService) {}

  /**
   * 1. Commercial Ledger Summary & Earnings Telemetry
   */
  @Get("ledger/summary")
  @HttpCode(HttpStatus.OK)
  async getLedgerSummary(@CurrentUser() user: AuthenticatedUser) {
    const distributor = await this.distributorService.resolveDistributor(user);
    return this.distributorService.getLedgerSummary(distributor.id);
  }

  /**
   * 2. Financial Transactions Ledger
   */
  @Get("ledger/transactions")
  @HttpCode(HttpStatus.OK)
  async getTransactions(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(QueryTransactionsDtoSchema)) query: QueryTransactionsDto,
  ) {
    const distributor = await this.distributorService.resolveDistributor(user);
    return this.distributorService.getTransactions(distributor.id, query);
  }

  @Post("ledger/transactions")
  @HttpCode(HttpStatus.CREATED)
  async recordTransaction(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(RecordTransactionDtoSchema)) dto: RecordTransactionDto,
  ) {
    const distributor = await this.distributorService.resolveDistributor(user);
    return this.distributorService.recordTransaction(distributor.id, dto);
  }

  /**
   * 3. Commission Payout Withdrawal Requests & Settlement History
   */
  @Get("payouts")
  @HttpCode(HttpStatus.OK)
  async getPayouts(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(QueryPayoutsDtoSchema)) query: QueryPayoutsDto,
  ) {
    const distributor = await this.distributorService.resolveDistributor(user);
    return this.distributorService.getPayouts(distributor.id, query);
  }

  @Post("payouts/request")
  @HttpCode(HttpStatus.CREATED)
  async requestPayout(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(RequestPayoutDtoSchema)) dto: RequestPayoutDto,
  ) {
    const distributor = await this.distributorService.resolveDistributor(user);
    return this.distributorService.requestPayout(distributor.id, dto);
  }

  /**
   * 4. Managed Candidate Organizations (Scoped Sub-Tenants)
   */
  @Get("candidates")
  @HttpCode(HttpStatus.OK)
  async getCandidates(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(QueryCandidatesDtoSchema)) query: QueryCandidatesDto,
  ) {
    const distributor = await this.distributorService.resolveDistributor(user);
    return this.distributorService.getCandidates(distributor.id, query);
  }

  @Get("candidates/:id")
  @HttpCode(HttpStatus.OK)
  async getCandidateById(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ) {
    const distributor = await this.distributorService.resolveDistributor(user);
    return this.distributorService.getCandidateById(distributor.id, id);
  }

  @Post("candidates")
  @HttpCode(HttpStatus.CREATED)
  async onboardCandidate(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(OnboardCandidateDtoSchema)) dto: OnboardCandidateDto,
  ) {
    const distributor = await this.distributorService.resolveDistributor(user);
    return this.distributorService.onboardCandidate(distributor.id, dto);
  }

  /**
   * 5. Enquiries & Prospective Candidate Leads
   */
  @Get("enquiries")
  @HttpCode(HttpStatus.OK)
  async getEnquiries(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(QueryEnquiriesDtoSchema)) query: QueryEnquiriesDto,
  ) {
    const distributor = await this.distributorService.resolveDistributor(user);
    return this.distributorService.getEnquiries(distributor.id, query);
  }

  @Post("enquiries")
  @HttpCode(HttpStatus.CREATED)
  async createEnquiry(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateEnquiryDtoSchema)) dto: CreateEnquiryDto,
  ) {
    const distributor = await this.distributorService.resolveDistributor(user);
    return this.distributorService.createEnquiry(distributor.id, dto);
  }

  /**
   * 6. Distributor Profile & Bank Settlements
   */
  @Get("profile")
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    const distributor = await this.distributorService.resolveDistributor(user);
    return this.distributorService.getProfile(distributor.id);
  }

  @Patch("profile/bank-details")
  @HttpCode(HttpStatus.OK)
  async updateBankDetails(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(UpdateBankDetailsDtoSchema)) dto: UpdateBankDetailsDto,
  ) {
    const distributor = await this.distributorService.resolveDistributor(user);
    return this.distributorService.updateBankDetails(distributor.id, dto);
  }
}
