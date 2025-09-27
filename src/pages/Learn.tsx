import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Download,
    Search,
    ArrowUpDown,
    Filter,
    ChevronLeft,
    ChevronRight,
    Home,
} from "lucide-react";
import { Question } from "@/types";
import questionsData from "@/data/questions.json";

type SortField = "id" | "category" | "question" | "answer";
type SortDirection = "asc" | "desc";

const Learn = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [sortField, setSortField] = useState<SortField>("id");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState<number | "all">(10);

    const questions = questionsData as Question[];

    // Get unique categories
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(questions.map((q) => q.category))
        );
        return uniqueCategories.sort();
    }, [questions]);

    // Filter and sort questions
    const filteredAndSortedQuestions = useMemo(() => {
        const filtered = questions.filter((question) => {
            const matchesSearch =
                question.question
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                question.answer
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                question.category
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                question.id.toString().includes(searchTerm);

            const matchesCategory =
                categoryFilter === "all" ||
                question.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });

        // Sort the filtered results
        filtered.sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortField) {
                case "id":
                    aValue = a.id;
                    bValue = b.id;
                    break;
                case "category":
                    aValue = a.category;
                    bValue = b.category;
                    break;
                case "question":
                    aValue = a.question;
                    bValue = b.question;
                    break;
                case "answer":
                    aValue = a.answer;
                    bValue = b.answer;
                    break;
                default:
                    aValue = a.id;
                    bValue = b.id;
            }

            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortDirection === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else {
                return sortDirection === "asc"
                    ? (aValue as number) - (bValue as number)
                    : (bValue as number) - (aValue as number);
            }
        });

        return filtered;
    }, [questions, searchTerm, categoryFilter, sortField, sortDirection]);

    // Pagination logic
    const totalPages = useMemo(() => {
        if (recordsPerPage === "all") return 1;
        return Math.ceil(filteredAndSortedQuestions.length / recordsPerPage);
    }, [filteredAndSortedQuestions.length, recordsPerPage]);

    const paginatedQuestions = useMemo(() => {
        if (recordsPerPage === "all") return filteredAndSortedQuestions;

        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        return filteredAndSortedQuestions.slice(startIndex, endIndex);
    }, [filteredAndSortedQuestions, currentPage, recordsPerPage]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const exportToCSV = () => {
        const headers = ["ID", "Category", "Question", "Answer"];
        const csvContent = [
            headers.join(","),
            ...filteredAndSortedQuestions.map((q) =>
                [
                    q.id,
                    `"${q.category}"`,
                    `"${q.question.replace(/"/g, '""')}"`,
                    `"${q.answer.replace(/"/g, '""')}"`,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "interview-questions.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToJSON = () => {
        const jsonContent = JSON.stringify(filteredAndSortedQuestions, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "interview-questions.json");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gradient-hero">
            <div className="container mx-auto px-4 py-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/")}
                                className="flex items-center gap-2"
                            >
                                <Home className="h-4 w-4" />
                                Back to Home
                            </Button>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text">
                            Learn & Explore
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Browse all interview questions, search, filter, and
                            export data to study offline.
                        </p>
                    </div>

                    {/* Controls */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filters & Search
                            </CardTitle>
                            <CardDescription>
                                Search and filter questions to find exactly what
                                you need
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            placeholder="Search questions, answers, or categories..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select
                                    value={categoryFilter}
                                    onValueChange={setCategoryFilter}
                                >
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Categories
                                        </SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Export Buttons and Records Per Page */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={exportToCSV}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export CSV
                                    </Button>
                                    <Button
                                        onClick={exportToJSON}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export JSON
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        Show:
                                    </span>
                                    <Select
                                        value={recordsPerPage.toString()}
                                        onValueChange={(value) => {
                                            if (value === "all") {
                                                setRecordsPerPage("all");
                                            } else {
                                                setRecordsPerPage(
                                                    parseInt(value)
                                                );
                                            }
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">
                                                10
                                            </SelectItem>
                                            <SelectItem value="25">
                                                25
                                            </SelectItem>
                                            <SelectItem value="50">
                                                50
                                            </SelectItem>
                                            <SelectItem value="100">
                                                100
                                            </SelectItem>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results Summary */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {recordsPerPage === "all" ? (
                                <>
                                    Showing all{" "}
                                    {filteredAndSortedQuestions.length} of{" "}
                                    {questions.length} questions
                                </>
                            ) : (
                                <>
                                    Showing{" "}
                                    {Math.min(
                                        (currentPage - 1) * recordsPerPage + 1,
                                        filteredAndSortedQuestions.length
                                    )}{" "}
                                    to{" "}
                                    {Math.min(
                                        currentPage * recordsPerPage,
                                        filteredAndSortedQuestions.length
                                    )}{" "}
                                    of {filteredAndSortedQuestions.length}{" "}
                                    questions
                                </>
                            )}
                        </p>
                        <Badge variant="secondary">
                            {categoryFilter === "all"
                                ? "All Categories"
                                : categoryFilter}
                        </Badge>
                    </div>

                    {/* Data Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => handleSort("id")}
                                            >
                                                <div className="flex items-center gap-2">
                                                    ID
                                                    <ArrowUpDown className="h-4 w-4" />
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() =>
                                                    handleSort("category")
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    Category
                                                    <ArrowUpDown className="h-4 w-4" />
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() =>
                                                    handleSort("question")
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    Question
                                                    <ArrowUpDown className="h-4 w-4" />
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() =>
                                                    handleSort("answer")
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    Answer
                                                    <ArrowUpDown className="h-4 w-4" />
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedQuestions.map((question) => (
                                            <TableRow key={question.id}>
                                                <TableCell className="font-medium">
                                                    {question.id}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {question.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="max-w-md">
                                                    <div className="line-clamp-3">
                                                        {question.question}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-md">
                                                    <div className="line-clamp-3">
                                                        {question.answer}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pagination Controls */}
                    {recordsPerPage !== "all" && totalPages > 1 && (
                        <Card>
                            <CardContent className="py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.max(prev - 1, 1)
                                                )
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        prev + 1,
                                                        totalPages
                                                    )
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            Go to page:
                                        </span>
                                        <Select
                                            value={currentPage.toString()}
                                            onValueChange={(value) =>
                                                setCurrentPage(parseInt(value))
                                            }
                                        >
                                            <SelectTrigger className="w-[80px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from(
                                                    { length: totalPages },
                                                    (_, i) => i + 1
                                                ).map((page) => (
                                                    <SelectItem
                                                        key={page}
                                                        value={page.toString()}
                                                    >
                                                        {page}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {filteredAndSortedQuestions.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-8">
                                <p className="text-muted-foreground">
                                    No questions found matching your search
                                    criteria.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Learn;
